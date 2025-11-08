import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { CommentEntity } from './comment.entity';
import { UserEntity } from './user.entity';

/**
 * Estados possíveis de uma resposta no sistema
 */
export enum ReplyState {
  /** Resposta visível a outros utilizadores */
  VISIBLE = 'visible',
  /** Resposta oculta pelo utilizador ou moderação */
  HIDDEN = 'hidden',
}

/**
 * Entidade que representa uma resposta a um comentário
 * @table reply
 * @description Resposta (thread) para um comentário específico
 */
@Entity({ tableName: 'reply' })
export class ReplyEntity {
  /**
   * ID interno da resposta
   * @field id
   * @type number
   * @nullable false
   * @primary true
   * @description Identificador único interno
   */
  @PrimaryKey()
  id!: number;

  /**
   * ID público em formato UUID
   * @field publicId
   * @type string (UUID)
   * @nullable false
   * @unique true
   * @length 36
   * @default uuid_v4()
   * @description Identificador público para referência externa
   */
  @Unique()
  @Index({ name: 'idx_reply_public_id' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  publicId!: string;

  /**
   * Comentário ao qual a resposta pertence
   * @field comment
   * @type CommentEntity
   * @nullable false
   * @relationship many-to-one
   * @description Comentário pai desta resposta
   */
  @Index({ name: 'idx_reply_comment_id' })
  @ManyToOne(() => CommentEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  comment!: CommentEntity;

  /**
   * Utilizador que criou a resposta
   * @field user
   * @type UserEntity
   * @nullable false
   * @relationship many-to-one
   * @description Usuário criador da resposta
   */
  @Index({ name: 'idx_reply_user_id' })
  @ManyToOne(() => UserEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  user!: UserEntity;

  /**
   * Texto da resposta
   * @field text
   * @type string
   * @nullable false
   * @length 280
   * @description Conteúdo da resposta (máximo 280 caracteres)
   */
  @Property({ length: 280 })
  text!: string;

  /**
   * Estado da resposta
   * @field state
   * @type ReplyState (enum)
   * @nullable false
   * @default VISIBLE
   * @description VISIBLE ou HIDDEN (moderação)
   */
  @Index({ name: 'idx_reply_state' })
  @Enum(() => ReplyState)
  @Property({ default: ReplyState.VISIBLE })
  state: ReplyState = ReplyState.VISIBLE;

  /**
   * Usuário que apagou a resposta
   * @field deletedBy
   * @type UserEntity
   * @nullable true
   * @relationship many-to-one
   * @description Admin/moderador que apagou (soft delete)
   */
  @ManyToOne(() => UserEntity, {
    deleteRule: 'set null',
    updateRule: 'no action',
    nullable: true,
  })
  deletedBy?: UserEntity;

  /**
   * Timestamp da exclusão da resposta
   * @field deletedAt
   * @type Date
   * @nullable true
   * @description Data/hora da exclusão (soft delete)
   */
  @Property({ nullable: true })
  deletedAt?: Date;

  /**
   * Timestamp de criação da resposta
   * @field createdAt
   * @type Date
   * @nullable false
   * @default now()
   * @description Data/hora de criação
   */
  @Index({ name: 'idx_reply_created_at' })
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
