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

/**
 * Papéis de utilizador para controlo de acesso.
 */
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

/**
 * Representa um papel (role) que agrupa um conjunto de permissões.
 * @table role
 */
@Entity({ tableName: 'role' })
export class RoleEntity {
  /**
   * Identificador único interno.
   */
  @PrimaryKey()
  id!: number;

  /**
   * Nome legível para o papel.
   */
  @Property({ length: 50 })
  name!: string;

  /**
   * Identificador único do papel para uso na API.
   */
  @Index({ name: 'idx_role_api_name' })
  @Unique()
  @Property({ length: 50 })
  apiName!: RoleApiName;

  /**
   * Coleção de utilizadores que possuem este papel.
   */
  @ManyToMany({
    entity: () => UserEntity,
    mappedBy: (u) => u.roles,
    pivotEntity: () => UserRoleEntity,
  })
  users: Collection<UserEntity> = new Collection<UserEntity>(this);

  /**
   * Coleção de permissões associadas a este papel.
   */
  @ManyToMany({
    entity: () => PermissionEntity,
    pivotEntity: () => RolePermissionEntity,
  })
  permissions: Collection<PermissionEntity> = new Collection<PermissionEntity>(
    this,
  );
}
