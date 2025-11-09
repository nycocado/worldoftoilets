import {
  Entity,
  Index,
  PrimaryKey,
  Property,
  Unique,
  Collection,
  ManyToMany,
} from '@mikro-orm/core';
import { RoleEntity } from './role.entity';
import { RolePermissionEntity } from './role-permission.entity';

/**
 * Permissões disponíveis no sistema para controle de acesso
 */
export enum PermissionApiName {
  // Permissões de casas de banho
  VIEW_TOILETS = 'view-toilets',
  SEARCH_TOILETS = 'search-toilets',
  SUGGEST_TOILETS = 'suggest-toilets',
  CREATE_TOILETS = 'create-toilets',
  DELETE_TOILETS = 'delete-toilets',
  UNDELETE_TOILETS = 'undelete-toilets',
  EDIT_TOILETS = 'edit-toilets',
  REPORT_TOILETS = 'report-toilets',
  PUBLISH_TOILETS = 'publish-toilets',
  DISABLE_TOILETS = 'disable-toilets',
  VIEW_SUGGEST_TOILETS = 'view-suggest-toilets',
  REVIEW_SUGGEST_TOILETS = 'review-suggest-toilets',
  VIEW_REPORT_TOILETS = 'view-report-toilets',
  REVIEW_REPORT_TOILETS = 'review-report-toilets',
  // Permissões de comentários
  VIEW_COMMENTS = 'view-comments',
  SEARCH_COMMENTS = 'search-comments',
  CREATE_COMMENTS = 'create-comments',
  DELETE_COMMENTS = 'delete-comments',
  DELETE_SELF_COMMENTS = 'delete-self-comments',
  UNDELETE_COMMENTS = 'undelete-comments',
  EDIT_COMMENTS = 'edit-comments',
  REPORT_COMMENTS = 'report-comments',
  REACT_COMMENTS = 'react-comments',
  HIDE_COMMENTS = 'hide-comments',
  SHOW_COMMENTS = 'show-comments',
  VIEW_REPORT_COMMENTS = 'view-report-comments',
  REVIEW_REPORT_COMMENTS = 'review-report-comments',
  // Permissões de respostas
  VIEW_REPLIES = 'view-replies',
  SEARCH_REPLIES = 'search-replies',
  CREATE_REPLIES = 'create-replies',
  DELETE_REPLIES = 'delete-replies',
  DELETE_SELF_REPLIES = 'delete-self-replies',
  UNDELETE_REPLIES = 'undelete-replies',
  EDIT_REPLIES = 'edit-replies',
  HIDE_REPLIES = 'hide-replies',
  SHOW_REPLIES = 'show-replies',
  // Permissões de utilizadores
  VIEW_USERS = 'view-users',
  SEARCH_USERS = 'search-users',
  ACTIVATE_USER = 'activate-user',
  DEACTIVATE_USER = 'deactivate-user',
  EDIT_USERS = 'edit-users',
  REPORT_USERS = 'report-users',
  VIEW_REPORT_USERS = 'view-report-users',
  REVIEW_REPORT_USERS = 'review-report-users',
  VIEW_ROLES_USERS = 'view-roles-users',
  MODIFY_ROLES_USERS = 'modify-roles-users',
  CREATE_USERS = 'create-users',
  DELETE_USERS = 'delete-users',
  DELETE_SELF_USER = 'delete-self-user',
  // Permissões de parceiros
  VIEW_PARTNERS = 'view-partners',
  MANAGE_PARTNERS = 'manage-partners',
  DELETE_PARTNERS = 'delete-partners',
  REVIEW_PARTNERS = 'review-partners',
  MANAGE_PARTNER_CERTIFICATES = 'manage-partner-certificates',
  // Permissões especiais
  ROUTE_TOILETS = 'route-toilets',
}

/**
 * Entidade que representa uma permissão no sistema
 * @table permission
 * @description Permissão individual que pode ser atribuída por papéis
 */
@Entity({ tableName: 'permission' })
export class PermissionEntity {
  /**
   * ID interno da permissão
   * @field id
   * @type number
   * @nullable false
   * @primary true
   * @description Identificador único interno
   */
  @PrimaryKey()
  id!: number;

  /**
   * Nome descritivo da permissão
   * @field name
   * @type string
   * @nullable false
   * @length 50
   * @description Nome legível em português (ex: "Visualizar Casas de Banho")
   */
  @Property({ length: 50 })
  name!: string;

  /**
   * Nome único da API para identificar a permissão
   * @field apiName
   * @type PermissionApiName (enum)
   * @nullable false
   * @unique true
   * @length 50
   * @description Identificador da API em kebab-case (ex: "view-toilets")
   */
  @Index({ name: 'idx_permission_api_name' })
  @Unique()
  @Property({ length: 50 })
  apiName!: PermissionApiName;

  /**
   * Coleção de papéis que possuem esta permissão
   * @field roles
   * @type Collection<RoleEntity>
   * @relationship many-to-many
   * @description Papéis que incluem esta permissão
   */
  @ManyToMany({
    entity: () => RoleEntity,
    mappedBy: (r) => r.permissions,
    pivotEntity: () => RolePermissionEntity,
  })
  roles: Collection<RoleEntity> = new Collection<RoleEntity>(this);
}
