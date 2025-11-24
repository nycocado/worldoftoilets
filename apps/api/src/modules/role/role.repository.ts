import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { RoleApiName, RoleEntity, UserEntity } from '@database/entities';
import { EntityRepository, Transactional } from '@mikro-orm/mariadb';

/**
 * Gerencia o acesso e a persistência de dados para a entidade Role.
 */
@Injectable()
export class RoleRepository {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly repository: EntityRepository<RoleEntity>,
  ) {}

  /**
   * Busca cargos pelos seus nomes de API.
   *
   * @param {RoleApiName[]} apiNames Os nomes de API dos cargos.
   * @returns {Promise<RoleEntity[]>} Os cargos encontrados.
   */
  async findByApiNames(apiNames: RoleApiName[]): Promise<RoleEntity[]> {
    return await this.repository.find({
      apiName: { $in: apiNames },
    });
  }

  /**
   * Atribui os cargos padrão a um utilizador.
   *
   * @param {UserEntity} user O utilizador.
   * @returns {Promise<void>}
   */
  @Transactional()
  async assignDefaultRolesToUser(user: UserEntity): Promise<void> {
    const defaultRoles = await this.repository.find({
      apiName: {
        $in: [
          RoleApiName.COMMENTS_USER,
          RoleApiName.REACTION_USER,
          RoleApiName.SUGGEST_TOILETS_USER,
          RoleApiName.REACTION_USER,
          RoleApiName.REPORT_COMMENTS_USER,
          RoleApiName.REPORT_TOILETS_USER,
          RoleApiName.REPORT_USERS_USER,
        ],
      },
    });

    user.roles.add(defaultRoles);
  }

  /**
   * Atribui cargos específicos a um utilizador.
   *
   * @param {UserEntity} user O utilizador.
   * @param {RoleApiName[]} roles Os nomes de API dos cargos a atribuir.
   * @returns {Promise<void>}
   */
  @Transactional()
  async assignRolesToUser(
    user: UserEntity,
    roles: RoleApiName[],
  ): Promise<void> {
    const rolesToAssign = await this.repository.find({
      apiName: {
        $in: roles,
      },
    });

    user.roles.add(rolesToAssign);
  }

  /**
   * Remove cargos específicos de um utilizador.
   *
   * @param {UserEntity} user O utilizador.
   * @param {RoleApiName[]} roles Os nomes de API dos cargos a remover.
   * @returns {Promise<void>}
   */
  @Transactional()
  async removeRolesFromUser(
    user: UserEntity,
    roles: RoleApiName[],
  ): Promise<void> {
    const rolesToRemove = await this.repository.find({
      apiName: {
        $in: roles,
      },
    });

    user.roles.remove(rolesToRemove);
  }
}
