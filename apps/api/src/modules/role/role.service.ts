import { Injectable } from '@nestjs/common';
import { RoleRepository } from '@modules/role/role.repository';
import { RoleApiName, UserEntity } from '@database/entities';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async assignDefaultRolesToUser(user: UserEntity): Promise<void> {
    await this.roleRepository.assignDefaultRolesToUser(user);
  }

  async assignRolesToUser(
    user: UserEntity,
    roles: RoleApiName[],
  ): Promise<void> {
    await this.roleRepository.assignRolesToUser(user, roles);
  }
}
