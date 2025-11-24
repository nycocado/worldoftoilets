import { Entity, Index, ManyToOne, PrimaryKey, Unique } from '@mikro-orm/core';
import { RoleEntity } from './role.entity';
import { PermissionEntity } from './permission.entity';

/**
 * Entidade de junção que associa uma permissão a um papel.
 * @table role_permission
 */
@Entity({ tableName: 'role_permission' })
@Unique({
  properties: ['role', 'permission'],
  name: 'idx_role_permission_role_permission',
})
export class RolePermissionEntity {
  /**
   * Identificador único interno.
   */
  @PrimaryKey()
  id!: number;

  /**
   * O papel que possui a permissão.
   */
  @ManyToOne(() => RoleEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  role!: RoleEntity;

  /**
   * A permissão associada ao papel.
   */
  @Index({ name: 'idx_role_permission_permission_id' })
  @ManyToOne(() => PermissionEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  permission!: PermissionEntity;
}
