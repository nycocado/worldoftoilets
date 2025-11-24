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
 * Armazena um token para verificação de e-mail.
 * @table email_verification
 */
@Entity({ tableName: 'email_verification' })
@Index({
  name: 'idx_email_verification_user_token',
  properties: ['userCredential', 'token'],
})
export class EmailVerificationEntity {
  /**
   * Identificador único interno.
   */
  @PrimaryKey()
  id!: number;

  /**
   * As credenciais do utilizador associadas a este token.
   */
  @ManyToOne(() => UserCredentialEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  userCredential!: UserCredentialEntity;

  /**
   * O token de verificação (UUID) enviado ao utilizador.
   */
  @Unique({ name: 'idx_email_verification_token' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  token!: string;

  /**
   * Data e hora em que o token foi invalidado (para soft delete).
   */
  @Index({ name: 'idx_email_verification_invalid_at' })
  @Property({ nullable: true })
  invalidAt?: Date;

  /**
   * Data e hora em que o token expira automaticamente.
   */
  @Index({ name: 'idx_email_verification_expires_at' })
  @Property()
  expiresAt!: Date;

  /**
   * Data e hora de criação do token.
   */
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  /**
   * Data e hora da última atualização do token.
   */
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
