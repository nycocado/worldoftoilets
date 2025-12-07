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
 * Permissões de acesso para as funcionalidades do sistema.
 */
export enum PermissionApiName {
  VIEW_TOILETS = 'view-toilets',
  VIEW_ALL_TOILETS = 'view-all-toilets',
  SEARCH_TOILETS = 'search-toilets',
  SUGGEST_TOILETS = 'suggest-toilets',
  CREATE_TOILETS = 'create-toilets',
  DELETE_TOILETS = 'delete-toilets',
  UNDELETE_TOILETS = 'undelete-toilets',
  EDIT_TOILETS = 'edit-toilets',
  REPORT_TOILETS = 'report-toilets',
  PUBLISH_TOILETS = 'publish-toilets',
  ENABLE_TOILETS = 'enable-toilets',
  DISABLE_TOILETS = 'disable-toilets',
  VIEW_SUGGEST_TOILETS = 'view-suggest-toilets',
  REVIEW_SUGGEST_TOILETS = 'review-suggest-toilets',
  VIEW_REPORT_TOILETS = 'view-report-toilets',
  REVIEW_REPORT_TOILETS = 'review-report-toilets',
  VIEW_COMMENTS = 'view-comments',
  VIEW_ALL_COMMENTS = 'view-all-comments',
  SEARCH_COMMENTS = 'search-comments',
  CREATE_COMMENTS = 'create-comments',
  DELETE_COMMENTS = 'delete-comments',
  DELETE_SELF_COMMENTS = 'delete-self-comments',
  UNDELETE_COMMENTS = 'undelete-comments',
  EDIT_COMMENTS = 'edit-comments',
  EDIT_SELF_COMMENTS = 'edit-self-comments',
  REPORT_COMMENTS = 'report-comments',
  REACT_COMMENTS = 'react-comments',
  HIDE_COMMENTS = 'hide-comments',
  SHOW_COMMENTS = 'show-comments',
  VIEW_REPORT_COMMENTS = 'view-report-comments',
  REVIEW_REPORT_COMMENTS = 'review-report-comments',
  VIEW_REPLIES = 'view-replies',
  VIEW_ALL_REPLIES = 'view-all-replies',
  SEARCH_REPLIES = 'search-replies',
  CREATE_REPLIES = 'create-replies',
  DELETE_REPLIES = 'delete-replies',
  DELETE_SELF_REPLIES = 'delete-self-replies',
  UNDELETE_REPLIES = 'undelete-replies',
  EDIT_REPLIES = 'edit-replies',
  EDIT_SELF_REPLIES = 'edit-self-replies',
  HIDE_REPLIES = 'hide-replies',
  SHOW_REPLIES = 'show-replies',
  REPORT_REPLIES = 'report-replies',
  VIEW_REPORT_REPLIES = 'view-report-replies',
  REVIEW_REPORT_REPLIES = 'review-report-replies',
  VIEW_USERS = 'view-users',
  VIEW_ALL_USERS = 'view-all-users',
  SEARCH_USERS = 'search-users',
  ACTIVATE_USER = 'activate-user',
  DEACTIVATE_USERS = 'deactivate-users',
  EDIT_USERS = 'edit-users',
  REPORT_USERS = 'report-users',
  VIEW_REPORT_USERS = 'view-report-users',
  REVIEW_REPORT_USERS = 'review-report-users',
  VIEW_ROLES_USERS = 'view-roles-users',
  MODIFY_ROLES_USERS = 'modify-roles-users',
  CREATE_USERS = 'create-users',
  DELETE_USERS = 'delete-users',
  DELETE_SELF_USER = 'delete-self-user',
  VIEW_PARTNERS = 'view-partners',
  MANAGE_PARTNERS = 'manage-partners',
  DELETE_PARTNERS = 'delete-partners',
  REVIEW_PARTNERS = 'review-partners',
  MANAGE_PARTNER_CERTIFICATES = 'manage-partner-certificates',
  ROUTE_TOILETS = 'route-toilets',
}

/**
 * Representa uma permissão individual que pode ser atribuída a papéis.
 * @table permission
 */
@Entity({ tableName: 'permission' })
export class PermissionEntity {
  /**
   * Identificador único interno.
   */
  @PrimaryKey()
  id!: number;

  /**
   * Nome legível para a permissão.
   */
  @Property({ length: 50 })
  name!: string;

  /**
   * Identificador único da permissão para uso na API.
   */
  @Index({ name: 'idx_permission_api_name' })
  @Unique()
  @Property({ length: 50 })
  apiName!: PermissionApiName;

  /**
   * Coleção de papéis que contêm esta permissão.
   */
  @ManyToMany({
    entity: () => RoleEntity,
    mappedBy: (r) => r.permissions,
    pivotEntity: () => RolePermissionEntity,
  })
  roles: Collection<RoleEntity> = new Collection<RoleEntity>(this);
}
