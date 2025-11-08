import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { UserEntity } from './user.entity';
import { RoleEntity } from './role.entity';

/**
 * Entidade de junção (Many-to-Many) entre utilizadores e papéis
 * @table user_role
 * @description Atribuição de papéis a utilizadores (muitos-para-muitos)
 */
@Entity({ tableName: 'user_role' })
@Unique({ properties: ['user', 'role'], name: 'idx_user_role_user_role' })
export class UserRoleEntity {
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
   * Referência ao utilizador que possui o papel
   * @field user
   * @type UserEntity
   * @nullable false
   * @relationship many-to-one
   * @description Usuário nesta relação de papel
   */
  @ManyToOne(() => UserEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  user!: UserEntity;

  /**
   * Referência ao papel atribuído ao utilizador
   * @field role
   * @type RoleEntity
   * @nullable false
   * @relationship many-to-one
   * @description Papel/role atribuído ao usuário
   */
  @Index({ name: 'idx_user_role_role_id' })
  @ManyToOne(() => RoleEntity, {
    deleteRule: 'no action',
    updateRule: 'no action',
  })
  role!: RoleEntity;

  /**
   * Timestamp de atribuição do papel
   * @field createdAt
   * @type Date
   * @nullable false
   * @default now()
   * @description Data/hora de quando o papel foi atribuído
   */
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  /**
   * Timestamp da última atualização
   * @field updatedAt
   * @type Date
   * @nullable false
   * @default now()
   * @description Data/hora da última modificação
   */
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
