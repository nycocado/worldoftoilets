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

/**
 * Armazena as credenciais de autenticação (e-mail e palavra-passe) de um utilizador.
 * @table user_credential
 */
@Entity({ tableName: 'user_credential' })
export class UserCredentialEntity {
  /**
   * O utilizador associado a estas credenciais.
   */
  @OneToOne(() => UserEntity, {
    fieldName: 'id',
    primary: true,
    deleteRule: 'cascade',
    updateRule: 'no action',
    hidden: true,
  })
  user!: UserEntity;

  /**
   * O e-mail único do utilizador, usado para login.
   */
  @Unique()
  @Index({ name: 'idx_user_credential_email' })
  @Property({ length: 100 })
  email!: string;

  /**
   * A palavra-passe do utilizador (armazenada em hash).
   */
  @Property({ length: 255 })
  password!: string;

  /**
   * Indica se o e-mail do utilizador foi verificado.
   */
  @Property({ default: false })
  emailVerified: boolean = false;

  /**
   * Data e hora de criação das credenciais.
   */
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  /**
   * Data e hora da última atualização das credenciais.
   */
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  /**
   * Coleção de tokens de verificação de e-mail enviados.
   */
  @OneToMany(
    () => EmailVerificationEntity,
    (emailVerification) => emailVerification.userCredential,
  )
  emailVerifications: Collection<EmailVerificationEntity> =
    new Collection<EmailVerificationEntity>(this);

  /**
   * Coleção de tokens de redefinição de palavra-passe enviados.
   */
  @OneToMany(
    () => PasswordResetEntity,
    (passwordReset) => passwordReset.userCredential,
  )
  passwordResets: Collection<PasswordResetEntity> =
    new Collection<PasswordResetEntity>(this);
}
