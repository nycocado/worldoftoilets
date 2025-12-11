import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, Transactional } from '@mikro-orm/mariadb';
import { RefreshTokenEntity, UserEntity } from '@database/entities';

/**
 * Gerencia o acesso e a persistência de dados para a entidade RefreshToken.
 */
@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly repository: EntityRepository<RefreshTokenEntity>,
  ) {}

  /**
   * Busca um refresh token pelo seu valor.
   *
   * @param {string} token O token a ser buscado.
   * @returns {Promise<RefreshTokenEntity | null>} A entidade do token ou `null` se não for encontrado.
   */
  async findByToken(token: string): Promise<RefreshTokenEntity | null> {
    return this.repository.findOne(
      { token: token },
      { populate: ['user', 'user.credential', 'user.roles'] },
    );
  }

  /**
   * Busca todos os refresh tokens expirados.
   * @returns {Promise<RefreshTokenEntity[]>} A lista de entidades de token expiradas.
   */
  async findExpired(): Promise<RefreshTokenEntity[]> {
    return this.repository.find({
      expiresAt: { $lt: new Date() },
    });
  }

  /**
   * Cria um novo refresh token.
   *
   * @param {UserEntity} user O utilizador.
   * @param {Date} expiresAt A data de expiração do token.
   * @returns {Promise<RefreshTokenEntity>} A entidade do token criado.
   */
  @Transactional()
  async create(user: UserEntity, expiresAt: Date): Promise<RefreshTokenEntity> {
    const em = this.repository.getEntityManager();
    const refreshToken = new RefreshTokenEntity();
    refreshToken.user = user;
    refreshToken.expiresAt = expiresAt;
    em.persist(refreshToken);
    await em.flush();
    return refreshToken;
  }

  /**
   * Invalida um refresh token.
   *
   * @param {RefreshTokenEntity} refreshToken A entidade do token a ser invalidado.
   * @returns {Promise<RefreshTokenEntity>} A entidade do token invalidado.
   */
  @Transactional()
  async invalidate(
    refreshToken: RefreshTokenEntity,
  ): Promise<RefreshTokenEntity> {
    const em = this.repository.getEntityManager();
    refreshToken.invalidAt = new Date();
    em.persist(refreshToken);
    await em.flush();
    return refreshToken;
  }

  /**
   * Invalida todos os refresh tokens para um utilizador.
   *
   * @param {UserEntity} user O utilizador.
   * @returns {Promise<RefreshTokenEntity[]>} A lista de entidades de token invalidadas.
   */
  @Transactional()
  async invalidateAllByUser(user: UserEntity): Promise<RefreshTokenEntity[]> {
    const em = this.repository.getEntityManager();
    const tokens = await this.repository.find({ user: user });

    tokens.forEach((token) => {
      token.invalidAt = new Date();
    });

    em.persist(tokens);
    await em.flush();
    return tokens;
  }

  /**
   * Remove permanentemente os refresh tokens expirados.
   */
  @Transactional()
  async deleteExpired(): Promise<void> {
    const em = this.repository.getEntityManager();
    const tokens = await this.findExpired();
    em.remove(tokens);
    await em.flush();
  }
}
