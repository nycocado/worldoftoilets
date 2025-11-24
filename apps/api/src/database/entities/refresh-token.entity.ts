import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { UserEntity } from './user.entity';

/**
 * Armazena um token de atualização (refresh token) para renovação de sessão.
 * @table refresh_token
 */
@Entity({ tableName: 'refresh_token' })
export class RefreshTokenEntity {
  /**
   * Identificador único interno.
   */
  @PrimaryKey()
  id!: number;

  /**
   * O utilizador ao qual o token pertence.
   */
  @ManyToOne(() => UserEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  user!: UserEntity;

  /**
   * O token de atualização (UUID).
   */
  @Unique({ name: 'idx_refresh_token_token' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  token!: string;

  /**
   * Timestamp da última atualização de papéis (roles) do utilizador,
   * usado para invalidar o token quando os papéis são alterados.
   */
  @Property({ nullable: true })
  rolesUpdatedAt?: Date;

  /**
   * Data e hora em que o token foi invalidado (para soft delete).
   */
  @Index({ name: 'idx_refresh_token_invalid_at' })
  @Property({ nullable: true })
  invalidAt?: Date;

  /**
   * Data e hora em que o token expira automaticamente.
   */
  @Index({ name: 'idx_refresh_token_expires_at' })
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
   * Verifica se o token está expirado.
   */
  get isExpired(): boolean {
    return this.expiresAt < new Date();
  }
}
