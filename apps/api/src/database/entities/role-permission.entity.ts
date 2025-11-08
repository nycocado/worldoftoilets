import { Entity, Index, ManyToOne, PrimaryKey, Unique } from '@mikro-orm/core';
import { RoleEntity } from './role.entity';
import { PermissionEntity } from './permission.entity';

/**
 * Entidade de junção (Many-to-Many) entre papéis e permissões
 * @table role_permission
 * @description Atribuição de permissões a papéis (muitos-para-muitos)
 */
@Entity({ tableName: 'role_permission' })
@Unique({
  properties: ['role', 'permission'],
  name: 'idx_role_permission_role_permission',
})
export class RolePermissionEntity {
  /**
   * ID interno do relacionamento
   * @field id
   * @type number
   * @nullable false
   * @primary true
   * @description Identificador único interno
   */
  @PrimaryKey()
  id!: number;

  /**
   * Referência ao papel que possui a permissão
   * @field role
   * @type RoleEntity
   * @nullable false
   * @relationship many-to-one
   * @description Papel nesta relação de permissão
   */
  @ManyToOne(() => RoleEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  role!: RoleEntity;

  /**
   * Referência à permissão dentro do papel
   * @field permission
   * @type PermissionEntity
   * @nullable false
   * @relationship many-to-one
   * @description Permissão incluída neste papel
   */
  @Index({ name: 'idx_role_permission_permission_id' })
  @ManyToOne(() => PermissionEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  permission!: PermissionEntity;
}
