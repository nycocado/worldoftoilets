import {
  Collection,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  Property,
  Unique,
} from '@mikro-orm/core';
import { UserEntity } from './user.entity';
import { EmailVerificationEntity } from './email-verification.entity';
import { PasswordResetEntity } from './password-reset.entity';

@Entity({ tableName: 'user_credential' })
export class UserCredentialEntity {
  @OneToOne(() => UserEntity, {
    fieldName: 'id',
    primary: true,
    deleteRule: 'cascade',
    updateRule: 'no action',
    hidden: true,
  })
  user!: UserEntity;

  @Unique()
  @Index({ name: 'idx_user_credential_email' })
  @Property({ length: 100 })
  email!: string;

  @Property({ length: 255 })
  password!: string;

  @Property({ default: false })
  emailVerified: boolean = false;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @OneToMany(
    () => EmailVerificationEntity,
    (emailVerification) => emailVerification.userCredential,
  )
  emailVerifications = new Collection<EmailVerificationEntity>(this);

  @OneToMany(
    () => PasswordResetEntity,
    (passwordReset) => passwordReset.userCredential,
  )
  passwordResets = new Collection<PasswordResetEntity>(this);
}
