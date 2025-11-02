import { Entity, Index, ManyToOne, PrimaryKey, Unique } from '@mikro-orm/core';
import { RoleEntity } from './role.entity';
import { PermissionEntity } from './permission.entity';

@Entity({ tableName: 'role_permission' })
@Unique({
  properties: ['role', 'permission'],
  name: 'idx_role_permission_role_permission',
})
export class RolePermissionEntity {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => RoleEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  role!: RoleEntity;

  @Index({ name: 'idx_role_permission_permission_id' })
  @ManyToOne(() => PermissionEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  permission!: PermissionEntity;
}
