import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { RoleApiName, RoleEntity, UserEntity } from '@database/entities';
import { EntityRepository, Transactional } from '@mikro-orm/mariadb';

@Injectable()
export class RoleRepository {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly repository: EntityRepository<RoleEntity>,
  ) {}

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
}
