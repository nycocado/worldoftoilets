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
 * Entidade que armazena as credenciais de autenticação de um utilizador
 * @table user_credential
 * @description Credenciais (endereço eletrónico/senha) de autenticação de um utilizador
 */
@Entity({ tableName: 'user_credential' })
export class UserCredentialEntity {
  /**
   * Referência ao utilizador
   * @field user
   * @type UserEntity
   * @nullable false
   * @primary true
   * @relationship one-to-one
   * @description Relação 1:1 com UserEntity (chave primária)
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
   * Endereço eletrónico único do utilizador
   * @field email
   * @type string
   * @nullable false
   * @unique true
   * @length 100
   * @description Email para login e comunicação
   */
  @Unique()
  @Index({ name: 'idx_user_credential_email' })
  @Property({ length: 100 })
  email!: string;

  /**
   * Senha do utilizador
   * @field password
   * @type string (hashed)
   * @nullable false
   * @length 255
   * @description Hash bcrypt da senha (nunca em texto plano)
   */
  @Property({ length: 255 })
  password!: string;

  /**
   * Indicador de endereço eletrónico verificado
   * @field emailVerified
   * @type boolean
   * @nullable false
   * @default false
   * @description True se o endereço eletrónico foi confirmado via link
   */
  @Property({ default: false })
  emailVerified: boolean = false;

  /**
   * Timestamp de criação das credenciais
   * @field createdAt
   * @type Date
   * @nullable false
   * @default now()
   * @description Data/hora de criação da conta
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

  /**
   * Coleção de tokens de verificação de endereço eletrónico
   * @field emailVerifications
   * @type Collection<EmailVerificationEntity>
   * @relationship one-to-many
   * @description Tokens enviados para verificação de endereço eletrónico
   */
  @OneToMany(
    () => EmailVerificationEntity,
    (emailVerification) => emailVerification.userCredential,
  )
  emailVerifications: Collection<EmailVerificationEntity> =
    new Collection<EmailVerificationEntity>(this);

  /**
   * Coleção de tokens de reset de senha
   * @field passwordResets
   * @type Collection<PasswordResetEntity>
   * @relationship one-to-many
   * @description Tokens enviados para reset de senha
   */
  @OneToMany(
    () => PasswordResetEntity,
    (passwordReset) => passwordReset.userCredential,
  )
  passwordResets: Collection<PasswordResetEntity> =
    new Collection<PasswordResetEntity>(this);
}
