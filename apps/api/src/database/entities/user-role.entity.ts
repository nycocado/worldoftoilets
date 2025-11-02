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

@Entity({ tableName: 'user_role' })
@Unique({ properties: ['user', 'role'], name: 'idx_user_role_user_role' })
export class UserRoleEntity {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => UserEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  user!: UserEntity;

  @Index({ name: 'idx_user_role_role_id' })
  @ManyToOne(() => RoleEntity, {
    deleteRule: 'no action',
    updateRule: 'no action',
  })
  role!: RoleEntity;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
