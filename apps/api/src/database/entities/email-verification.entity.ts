import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { UserCredentialEntity } from '@database/entities/user-credential.entity';

@Entity({ tableName: 'email_verification' })
@Index({
  name: 'idx_email_verification_user_token',
  properties: ['userCredential', 'token'],
})
export class EmailVerificationEntity {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => UserCredentialEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  userCredential!: UserCredentialEntity;

  @Unique({ name: 'idx_email_verification_token' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  token!: string;

  @Index({ name: 'idx_email_verification_invalid_at' })
  @Property({ nullable: true })
  invalidAt?: Date;

  @Index({ name: 'idx_email_verification_expires_at' })
  @Property()
  expiresAt!: Date;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
