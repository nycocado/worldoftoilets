import { Injectable } from '@nestjs/common';
import { RoleRepository } from '@modules/role/role.repository';
import { RoleApiName, RoleEntity, UserEntity } from '@database/entities';

/**
 * Contém a lógica de negócio para as operações de cargos.
 */
@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  /**
   * Busca cargos pelos seus nomes de API.
   *
   * @param {RoleApiName[]} apiNames Os nomes de API dos cargos.
   * @returns {Promise<RoleEntity[]>} Os cargos encontrados.
   */
  async getRolesByApiNames(apiNames: RoleApiName[]): Promise<RoleEntity[]> {
    return await this.roleRepository.findByApiNames(apiNames);
  }

  /**
   * Atribui os cargos padrão a um utilizador.
   *
   * @param {UserEntity} user O utilizador.
   * @returns {Promise<void>}
   */
  async assignDefaultRolesToUser(user: UserEntity): Promise<void> {
    await this.roleRepository.assignDefaultRolesToUser(user);
  }

  /**
   * Atribui cargos específicos a um utilizador.
   *
   * @param {UserEntity} user O utilizador.
   * @param {RoleApiName[]} roles Os nomes de API dos cargos a atribuir.
   * @returns {Promise<void>}
   */
  async assignRolesToUser(
    user: UserEntity,
    roles: RoleApiName[],
  ): Promise<void> {
    await this.roleRepository.assignRolesToUser(user, roles);
  }

  /**
   * Remove cargos específicos de um utilizador.
   *
   * @param {UserEntity} user O utilizador.
   * @param {RoleApiName[]} roles Os nomes de API dos cargos a remover.
   * @returns {Promise<void>}
   */
  async removeRolesFromUser(
    user: UserEntity,
    roles: RoleApiName[],
  ): Promise<void> {
    await this.roleRepository.removeRolesFromUser(user, roles);
  }
}
