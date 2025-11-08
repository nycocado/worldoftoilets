import {
  Collection,
  Entity,
  Enum,
  Index,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { InteractionEntity } from './interaction.entity';
import { UserEntity } from './user.entity';
import { CommentRateEntity } from './comment-rate.entity';
import { ReactEntity } from './react.entity';
import { ReplyEntity } from './reply.entity';

/**
 * Estados possíveis de um comentário no sistema
 */
export enum CommentState {
  /** Comentário visível a outros utilizadores */
  VISIBLE = 'visible',
  /** Comentário oculto pelo utilizador ou moderação */
  HIDDEN = 'hidden',
}

/**
 * Entidade que representa um comentário sobre uma casa de banho
 * @table comment
 * @description Comentário com avaliação sobre uma casa de banho específica
 */
@Entity({ tableName: 'comment' })
export class CommentEntity {
  /**
   * ID interno do comentário
   * @field id
   * @type number
   * @nullable false
   * @primary true
   * @hidden true
   * @description Identificador único interno (não exposto na API)
   */
  @PrimaryKey({ hidden: true })
  id!: number;

  /**
   * ID público do comentário em formato UUID
   * @field publicId
   * @type string (UUID)
   * @nullable false
   * @unique true
   * @length 36
   * @default uuid_v4()
   * @description Identificador público para referência externa
   */
  @Unique()
  @Index({ name: 'idx_comment_public_id' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  publicId!: string;

  /**
   * Interação base associada ao comentário
   * @field interaction
   * @type InteractionEntity
   * @nullable false
   * @relationship one-to-one
   * @unique true
   * @description Relação 1:1 com a interação que originou este comentário
   */
  @Unique({ name: 'idx_comment_interaction_id' })
  @OneToOne(() => InteractionEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  interaction!: InteractionEntity;

  /**
   * Texto do comentário
   * @field text
   * @type string
   * @nullable true
   * @length 280
   * @description Conteúdo do comentário (similar a tweet, máximo 280 caracteres)
   */
  @Property({ length: 280, nullable: true })
  text?: string;

  /**
   * Pontuação do comentário calculada a partir de reações e relevância
   * @field score
   * @type number
   * @nullable false
   * @description Score agregado baseado em reações e algoritmo de relevância
   */
  @Property()
  score!: number;

  /**
   * Estado do comentário
   * @field state
   * @type CommentState (enum)
   * @nullable false
   * @default VISIBLE
   * @description Indica se o comentário está visível ou oculto (moderação)
   */
  @Index({ name: 'idx_comment_state' })
  @Enum(() => CommentState)
  @Property({ default: CommentState.VISIBLE })
  state: CommentState = CommentState.VISIBLE;

  /**
   * Utilizador que apagou o comentário
   * @field deletedBy
   * @type UserEntity
   * @nullable true
   * @relationship many-to-one
   * @description Referência ao admin/moderador que apagou (soft delete)
   */
  @ManyToOne(() => UserEntity, {
    deleteRule: 'set null',
    updateRule: 'no action',
    nullable: true,
  })
  deletedBy?: UserEntity;

  /**
   * Timestamp da exclusão do comentário
   * @field deletedAt
   * @type Date
   * @nullable true
   * @description Data/hora da exclusão (soft delete)
   */
  @Property({ nullable: true })
  deletedAt?: Date;

  /**
   * Timestamp de criação do comentário
   * @field createdAt
   * @type Date
   * @nullable false
   * @default now()
   * @description Data/hora de criação do comentário
   */
  @Index({ name: 'idx_comment_created_at' })
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
   * Avaliação detalhada do comentário
   * @field rate
   * @type CommentRateEntity
   * @nullable true
   * @relationship one-to-one
   * @description Ratings detalhados (limpeza, papel, estrutura, acessibilidade)
   */
  @OneToOne(() => CommentRateEntity, (rate) => rate.comment, {
    nullable: true,
    mappedBy: 'comment',
  })
  rate?: CommentRateEntity;

  /**
   * Coleção de reações ao comentário
   * @field reacts
   * @type Collection<ReactEntity>
   * @relationship one-to-many
   * @description Likes/dislikes de utilizadores a este comentário
   */
  @OneToMany(() => ReactEntity, (react) => react.comment)
  reacts: Collection<ReactEntity> = new Collection<ReactEntity>(this);

  /**
   * Coleção de respostas ao comentário
   * @field replies
   * @type Collection<ReplyEntity>
   * @relationship one-to-many
   * @description Respostas/threads de outros utilizadores a este comentário
   */
  @OneToMany(() => ReplyEntity, (reply) => reply.comment)
  replies: Collection<ReplyEntity> = new Collection<ReplyEntity>(this);
}
