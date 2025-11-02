import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { UserEntity } from './user.entity';

@Entity({ tableName: 'refresh_token' })
export class RefreshTokenEntity {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => UserEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  user!: UserEntity;

  @Unique({ name: 'idx_refresh_token_token' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  token!: string;

  @Index({ name: 'idx_refresh_token_invalid_at' })
  @Property({ nullable: true })
  invalidAt?: Date;

  @Property({ nullable: true })
  rolesUpdatedAt?: Date;

  @Index({ name: 'idx_refresh_token_expires_at' })
  @Property()
  expiresAt!: Date;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
