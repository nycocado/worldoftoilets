import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, Transactional } from '@mikro-orm/mariadb';
import { PermissionApiName, UserEntity, UserIcon } from '@database/entities';

/**
 * Gerencia o acesso e a persistência de dados para a entidade User.
 */
@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: EntityRepository<UserEntity>,
  ) {}

  /**
   * Verifica se um utilizador possui alguma das permissões especificadas.
   *
   * @param {string} publicId O ID público do utilizador.
   * @param {PermissionApiName[]} apiNames Os nomes das permissões a verificar.
   * @returns {Promise<boolean>} `true` se o utilizador possuir alguma das permissões.
   */
  async hasPermissions(
    publicId: string,
    apiNames: PermissionApiName[],
  ): Promise<boolean> {
    const user = await this.repository.findOne(
      {
        publicId: publicId,
        roles: {
          $some: {
            permissions: {
              $some: {
                apiName: { $in: apiNames },
              },
            },
          },
        },
      },
      {
        populate: ['roles', 'roles.permissions'],
      },
    );
    return !!user;
  }

  /**
   * Busca um utilizador pelo seu ID público.
   *
   * @param {string} publicId O ID público do utilizador.
   * @returns {Promise<UserEntity | null>} O utilizador ou `null` se não encontrado.
   */
  async findByPublicId(publicId: string): Promise<UserEntity | null> {
    return await this.repository.findOne(
      { publicId },
      { populate: ['credential', 'roles', 'commentsCount'] },
    );
  }

  /**
   * Busca um utilizador pelo seu email.
   *
   * @param {string} email O email do utilizador.
   * @returns {Promise<UserEntity | null>} O utilizador ou `null` se não encontrado.
   */
  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.repository.findOne(
      { credential: { email } },
      { populate: ['credential', 'roles', 'commentsCount'] },
    );
  }

  /**
   * Busca um utilizador pelo token de refresh.
   *
   * @param {string} token O token de refresh.
   * @returns {Promise<UserEntity | null>} O utilizador ou `null` se não encontrado.
   */
  async findByRefreshToken(token: string): Promise<UserEntity | null> {
    return await this.repository.findOne(
      { refreshTokens: { token } },
      { populate: ['roles'] },
    );
  }

  /**
   * Verifica se existe um utilizador com o email especificado.
   *
   * @param {string} email O email a verificar.
   * @returns {Promise<boolean>} `true` se existir um utilizador com este email.
   */
  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.repository.findOne({ credential: { email } });
    return !!user;
  }

  /**
   * Lista utilizadores com paginação e filtros.
   *
   * @param {string} [search] Termo de pesquisa para nome ou email.
   * @param {boolean} [includeDeactivated] Incluir utilizadores desativados.
   * @param {boolean} [pageable] Aplicar paginação.
   * @param {number} [page] Número da página.
   * @param {number} [size] Tamanho da página.
   * @param {Date} [timestamp] Timestamp de referência para paginação.
   * @returns {Promise<UserEntity[]>} Lista de utilizadores.
   */
  async findAll(
    search?: string,
    includeDeactivated?: boolean,
    pageable?: boolean,
    page?: number,
    size?: number,
    timestamp?: Date,
  ): Promise<UserEntity[]> {
    const where: Record<string, unknown> = {
      createdAt: { $lte: timestamp },
    };

    if (!includeDeactivated) {
      where.deactivatedAt = null;
    }

    if (search) {
      where.$or = [
        { name: { $like: `%${search}%` } },
        { credential: { email: { $like: `%${search}%` } } },
      ];
    }

    return await this.repository.find(where, {
      populate: ['credential', 'roles', 'commentsCount'],
      orderBy: { createdAt: 'DESC' },
      limit: pageable ? size : undefined,
      offset: pageable && page && size ? page * size : undefined,
    });
  }

  /**
   * Atualiza os dados de um utilizador.
   *
   * @param {UserEntity} user A entidade do utilizador.
   * @param {string} [name] O novo nome.
   * @param {UserIcon} [icon] O novo ícone.
   * @param {string} [birthDate] A nova data de nascimento.
   * @returns {Promise<UserEntity>} O utilizador atualizado.
   */
  @Transactional()
  async update(
    user: UserEntity,
    name?: string,
    icon?: UserIcon,
    birthDate?: string,
  ): Promise<UserEntity> {
    const em = this.repository.getEntityManager();

    if (name !== undefined) {
      user.name = name;
    }
    if (icon !== undefined) {
      user.icon = icon;
    }
    if (birthDate !== undefined) {
      user.birthDate = new Date(birthDate);
    }

    await em.persistAndFlush(user);
    return user;
  }

  /**
   * Desativa um utilizador (soft delete).
   *
   * @param {UserEntity} user O utilizador a desativar.
   * @param {UserEntity} deactivatedBy O utilizador que realizou a desativação.
   * @returns {Promise<void>}
   */
  @Transactional()
  async softDelete(user: UserEntity, deactivatedBy: UserEntity): Promise<void> {
    const em = this.repository.getEntityManager();
    user.deactivatedAt = new Date();
    user.deactivatedBy = deactivatedBy;
    await em.flush();
  }

  /**
   * Reverte o soft delete de um utilizador.
   *
   * @param {UserEntity} user O utilizador a recuperar.
   * @returns {Promise<UserEntity>} A entidade do utilizador restaurado.
   */
  @Transactional()
  async undelete(user: UserEntity): Promise<UserEntity> {
    const em = this.repository.getEntityManager();
    user.deactivatedAt = undefined;
    user.deactivatedBy = undefined;
    await em.persistAndFlush(user);
    return user;
  }

  /**
   * Cria um novo utilizador.
   *
   * @param {string} name O nome do utilizador.
   * @param {UserIcon | undefined} icon O ícone do utilizador.
   * @param {string} birthDate A data de nascimento.
   * @returns {Promise<UserEntity>} O utilizador criado.
   */
  @Transactional()
  async create(
    name: string,
    icon: UserIcon | undefined,
    birthDate: string,
  ): Promise<UserEntity> {
    const em = this.repository.getEntityManager();
    const user = new UserEntity();
    user.name = name;
    user.icon = icon || UserIcon.ICON_DEFAULT;
    user.birthDate = new Date(birthDate);
    user.points = 0;

    await em.persistAndFlush(user);
    return user;
  }
}
