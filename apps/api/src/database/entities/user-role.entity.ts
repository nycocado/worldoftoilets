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
 * Entidade de junção que associa um utilizador a um papel.
 * @table user_role
 */
@Entity({ tableName: 'user_role' })
@Unique({ properties: ['user', 'role'], name: 'idx_user_role_user_role' })
export class UserRoleEntity {
  /**
   * Identificador único interno.
   */
  @PrimaryKey()
  id!: number;

  /**
   * O utilizador que possui o papel.
   */
  @ManyToOne(() => UserEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  user!: UserEntity;

  /**
   * O papel atribuído ao utilizador.
   */
  @Index({ name: 'idx_user_role_role_id' })
  @ManyToOne(() => RoleEntity, {
    deleteRule: 'no action',
    updateRule: 'no action',
  })
  role!: RoleEntity;

  /**
   * Data e hora de atribuição do papel.
   */
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  /**
   * Data e hora da última atualização da atribuição.
   */
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
