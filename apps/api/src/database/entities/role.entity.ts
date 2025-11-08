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
 * Papéis disponíveis no sistema
 * Combinam múltiplas permissões para controle de acesso granular
 */
export enum RoleApiName {
  // Papéis de utilizador comum
  COMMENTS_USER = 'comments-user',
  REPORT_COMMENTS_USER = 'report-comments-user',
  REACTION_USER = 'reaction-user',
  REPORT_TOILETS_USER = 'report-toilets-user',
  SUGGEST_TOILETS_USER = 'suggest-toilets-user',
  REPORT_USERS_USER = 'report-users-user',
  DEAD_USER = 'dead-user',
  // Papéis de administrador
  COMMENTS_ADMINISTRATOR = 'comments-administrator',
  TOILETS_ADMINISTRATOR = 'toilets-administrator',
  USERS_ADMINISTRATOR = 'users-administrator',
  PARTNERS_ADMINISTRATOR = 'partners-administrator',
  DEAD_ADMINISTRATOR = 'dead-administrator',
  // Papel de parceiro
  PARTNER = 'partner',
}

/**
 * Entidade que representa um papel no sistema
 * @table role
 * @description Conjunto de permissões atribuído a utilizadores
 */
@Entity({ tableName: 'role' })
export class RoleEntity {
  /**
   * ID interno do papel
   * @field id
   * @type number
   * @nullable false
   * @primary true
   * @description Identificador único interno
   */
  @PrimaryKey()
  id!: number;

  /**
   * Nome descritivo do papel
   * @field name
   * @type string
   * @nullable false
   * @length 50
   * @description Nome legível em português (ex: "Administrador de Comentários")
   */
  @Property({ length: 50 })
  name!: string;

  /**
   * Nome único da API para identificar o papel
   * @field apiName
   * @type RoleApiName (enum)
   * @nullable false
   * @unique true
   * @length 50
   * @description Identificador da API em kebab-case (ex: "comments-administrator")
   */
  @Index({ name: 'idx_role_api_name' })
  @Unique()
  @Property({ length: 50 })
  apiName!: RoleApiName;

  /**
   * Coleção de utilizadores que possuem este papel
   * @field users
   * @type Collection<UserEntity>
   * @relationship many-to-many
   * @description Usuários com este papel atribuído
   */
  @ManyToMany({
    entity: () => UserEntity,
    mappedBy: (u) => u.roles,
    pivotEntity: () => UserRoleEntity,
  })
  users: Collection<UserEntity> = new Collection<UserEntity>(this);

  /**
   * Coleção de permissões contidas neste papel
   * @field permissions
   * @type Collection<PermissionEntity>
   * @relationship many-to-many
   * @description Permissões que compõem este papel
   */
  @ManyToMany({
    entity: () => PermissionEntity,
    pivotEntity: () => RolePermissionEntity,
  })
  permissions: Collection<PermissionEntity> = new Collection<PermissionEntity>(
    this,
  );
}
