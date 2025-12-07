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
 * Armazena um token para redefinição de palavra-passe.
 * @table password_reset
 */
@Entity({ tableName: 'password_reset' })
@Index({
  name: 'idx_password_reset_user_token',
  properties: ['userCredential', 'token'],
})
export class PasswordResetEntity {
  /**
   * Identificador único interno.
   */
  @PrimaryKey()
  id!: number;

  /**
   * As credenciais do utilizador que solicitou a redefinição.
   */
  @ManyToOne(() => UserCredentialEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  userCredential!: UserCredentialEntity;

  /**
   * O token de redefinição (UUID) enviado ao utilizador.
   */
  @Unique({ name: 'idx_password_reset_token' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  token!: string;

  /**
   * Data e hora em que o token foi invalidado (para soft delete).
   */
  @Index({ name: 'idx_password_reset_invalid_at' })
  @Property({ nullable: true })
  invalidAt?: Date;

  /**
   * Data e hora em que o token expira automaticamente.
   */
  @Index({ name: 'idx_password_reset_expires_at' })
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

  /**
   * Verifica se o token está expirado ou foi invalidado.
   */
  get isExpired(): boolean {
    return (
      this.expiresAt < new Date() ||
      (this.invalidAt !== undefined && this.invalidAt >= new Date())
    );
  }
}
