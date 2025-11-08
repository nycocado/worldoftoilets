import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { UserCredentialEntity } from '@database/entities/user-credential.entity';

/**
 * Entidade que representa um token de verificação de endereço eletrónico
 * @table email_verification
 * @description Token enviado por endereço eletrónico para verificação de endereço eletrónico
 */
@Entity({ tableName: 'email_verification' })
@Index({
  name: 'idx_email_verification_user_token',
  properties: ['userCredential', 'token'],
})
export class EmailVerificationEntity {
  /**
   * ID interno da verificação de endereço eletrónico
   * @field id
   * @type number
   * @nullable false
   * @primary true
   * @description Identificador único interno
   */
  @PrimaryKey()
  id!: number;

  /**
   * Referência às credenciais do utilizador
   * @field userCredential
   * @type UserCredentialEntity
   * @nullable false
   * @relationship many-to-one
   * @description Credenciais do utilizador que solicitou verificação
   */
  @ManyToOne(() => UserCredentialEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  userCredential!: UserCredentialEntity;

  /**
   * Token único de verificação
   * @field token
   * @type string (UUID)
   * @nullable false
   * @unique true
   * @length 36
   * @default uuid_v4()
   * @description Token aleatório enviado no email para confirmar posse
   */
  @Unique({ name: 'idx_email_verification_token' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  token!: string;

  /**
   * Timestamp de invalidação do token
   * @field invalidAt
   * @type Date
   * @nullable true
   * @description Data/hora quando o token foi marcado como inválido (soft delete)
   */
  @Index({ name: 'idx_email_verification_invalid_at' })
  @Property({ nullable: true })
  invalidAt?: Date;

  /**
   * Timestamp de expiração automática do token
   * @field expiresAt
   * @type Date
   * @nullable false
   * @description Data/hora quando o token expira automaticamente
   */
  @Index({ name: 'idx_email_verification_expires_at' })
  @Property()
  expiresAt!: Date;

  /**
   * Timestamp de criação do token
   * @field createdAt
   * @type Date
   * @nullable false
   * @default now()
   * @description Data/hora de criação do token
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
