import {
  Entity,
  Index,
  PrimaryKey,
  Property,
  Unique,
  Collection,
  ManyToMany,
} from '@mikro-orm/core';
import { UserEntity } from './user.entity';
import { UserRoleEntity } from './user-role.entity';
import { PermissionEntity } from './permission.entity';
import { RolePermissionEntity } from './role-permission.entity';

export enum RoleApiName {
  COMMENTS_USER = 'comments-user',
  REPORT_COMMENTS_USER = 'report-comments-user',
  REACTION_USER = 'reaction-user',
  REPORT_TOILETS_USER = 'report-toilets-user',
  SUGGEST_TOILETS_USER = 'suggest-toilets-user',
  REPORT_USERS_USER = 'report-users-user',
  DEAD_USER = 'dead-user',
  COMMENTS_ADMINISTRATOR = 'comments-administrator',
  TOILETS_ADMINISTRATOR = 'toilets-administrator',
  USERS_ADMINISTRATOR = 'users-administrator',
  PARTNERS_ADMINISTRATOR = 'partners-administrator',
  DEAD_ADMINISTRATOR = 'dead-administrator',
  PARTNER = 'partner',
}

@Entity({ tableName: 'role' })
export class RoleEntity {
  @PrimaryKey()
  id!: number;

  @Property({ length: 50 })
  name!: string;

  @Index({ name: 'idx_role_api_name' })
  @Unique()
  @Property({ length: 50 })
  apiName!: RoleApiName;

  @ManyToMany({
    entity: () => UserEntity,
    mappedBy: (u) => u.roles,
    pivotEntity: () => UserRoleEntity,
  })
  users = new Collection<UserEntity>(this);

  @ManyToMany({
    entity: () => PermissionEntity,
    pivotEntity: () => RolePermissionEntity,
  })
  permissions = new Collection<PermissionEntity>(this);
}
