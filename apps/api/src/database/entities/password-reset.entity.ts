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
 * Entidade que representa um token de reset de senha
 * @table password_reset
 * @description Token enviado por endereço eletrónico para reset de senha de segurança
 */
@Entity({ tableName: 'password_reset' })
@Index({
  name: 'idx_password_reset_user_token',
  properties: ['userCredential', 'token'],
})
export class PasswordResetEntity {
  /**
   * ID interno do reset de senha
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
   * @description Credenciais do utilizador que solicitou reset
   */
  @ManyToOne(() => UserCredentialEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  userCredential!: UserCredentialEntity;

  /**
   * Token único de reset
   * @field token
   * @type string (UUID)
   * @nullable false
   * @unique true
   * @length 36
   * @default uuid_v4()
   * @description Token aleatório enviado no email para reset
   */
  @Unique({ name: 'idx_password_reset_token' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  token!: string;

  /**
   * Timestamp de invalidação do token
   * @field invalidAt
   * @type Date
   * @nullable true
   * @description Data/hora quando o token foi marcado como inválido
   */
  @Index({ name: 'idx_password_reset_invalid_at' })
  @Property({ nullable: true })
  invalidAt?: Date;

  /**
   * Timestamp de expiração automática do token
   * @field expiresAt
   * @type Date
   * @nullable false
   * @description Data/hora quando o token expira automaticamente
   */
  @Index({ name: 'idx_password_reset_expires_at' })
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
