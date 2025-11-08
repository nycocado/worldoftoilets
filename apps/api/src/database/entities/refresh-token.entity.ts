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
 * Entidade que representa um token de refresh para autenticação
 * @table refresh_token
 * @description Token de longa vida para renovação de sessões
 */
@Entity({ tableName: 'refresh_token' })
export class RefreshTokenEntity {
  /**
   * ID interno do token
   * @field id
   * @type number
   * @nullable false
   * @primary true
   * @description Identificador único interno
   */
  @PrimaryKey()
  id!: number;

  /**
   * Referência ao utilizador dono do token
   * @field user
   * @type UserEntity
   * @nullable false
   * @relationship many-to-one
   * @description Usuário proprietário deste token
   */
  @ManyToOne(() => UserEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  user!: UserEntity;

  /**
   * Token único
   * @field token
   * @type string (UUID)
   * @nullable false
   * @unique true
   * @length 36
   * @default uuid_v4()
   * @description Token seguro para refresh de sessão
   */
  @Unique({ name: 'idx_refresh_token_token' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  token!: string;

  /**
   * Timestamp do último update de papéis do utilizador
   * @field rolesUpdatedAt
   * @type Date
   * @nullable true
   * @description Para invalidação automática de tokens quando papéis mudam
   */
  @Property({ nullable: true })
  rolesUpdatedAt?: Date;

  /**
   * Timestamp de invalidação do token
   * @field invalidAt
   * @type Date
   * @nullable true
   * @description Data/hora quando o token foi marcado como inválido
   */
  @Index({ name: 'idx_refresh_token_invalid_at' })
  @Property({ nullable: true })
  invalidAt?: Date;

  /**
   * Timestamp de expiração automática do token
   * @field expiresAt
   * @type Date
   * @nullable false
   * @description Data/hora quando o token expira automaticamente
   */
  @Index({ name: 'idx_refresh_token_expires_at' })
  @Property()
  expiresAt!: Date;

  /**
   * Timestamp de criação do token
   * @field createdAt
   * @type Date
   * @nullable false
   * @default now()
   * @description Data/hora de criação
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
