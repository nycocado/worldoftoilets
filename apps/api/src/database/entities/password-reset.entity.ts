import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { UserCredentialEntity } from '@database/entities/user-credential.entity';

@Entity({ tableName: 'password_reset' })
@Index({
  name: 'idx_password_reset_user_token',
  properties: ['userCredential', 'token'],
})
export class PasswordResetEntity {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => UserCredentialEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  userCredential!: UserCredentialEntity;

  @Unique({ name: 'idx_password_reset_token' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  token!: string;

  @Index({ name: 'idx_password_reset_invalid_at' })
  @Property({ nullable: true })
  invalidAt?: Date;

  @Index({ name: 'idx_password_reset_expires_at' })
  @Property()
  expiresAt!: Date;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
