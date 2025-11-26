import {
  Collection,
  Entity,
  Enum,
  Formula,
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
import { ReactEntity, ReactDiscriminator } from './react.entity';
import { ReplyEntity } from './reply.entity';

/**
 * Estados de visibilidade de um comentário.
 */
export enum CommentState {
  /** Visível para todos. */
  VISIBLE = 'visible',
  /** Oculto por moderação ou pelo autor. */
  HIDDEN = 'hidden',
}

/**
 * Armazena um comentário de um utilizador sobre uma casa de banho.
 * @table comment
 */
@Entity({ tableName: 'comment' })
export class CommentEntity {
  /**
   * Identificador único interno.
   */
  @PrimaryKey()
  id!: number;

  /**
   * Identificador público (UUID) para partilha externa através da API.
   */
  @Unique()
  @Index({ name: 'idx_comment_public_id' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  publicId!: string;

  /**
   * A interação que originou este comentário.
   */
  @Unique({ name: 'idx_comment_interaction_id' })
  @OneToOne(() => InteractionEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
    orphanRemoval: true,
  })
  interaction!: InteractionEntity;

  /**
   * O conteúdo do comentário, limitado a 280 caracteres.
   */
  @Property({ length: 280, nullable: true })
  text?: string;

  /**
   * Pontuação agregada para ordenação por relevância.
   */
  @Property()
  score: number = 0;

  /**
   * Estado de visibilidade do comentário.
   */
  @Index({ name: 'idx_comment_state' })
  @Enum(() => CommentState)
  @Property({ default: CommentState.VISIBLE })
  state: CommentState = CommentState.VISIBLE;

  /**
   * Referência ao administrador que realizou o soft delete.
   */
  @ManyToOne(() => UserEntity, {
    deleteRule: 'set null',
    updateRule: 'no action',
    nullable: true,
  })
  deletedBy?: UserEntity;

  /**
   * Data e hora da exclusão (para soft delete).
   */
  @Property({ nullable: true })
  deletedAt?: Date;

  /**
   * Data e hora de criação do comentário.
   */
  @Index({ name: 'idx_comment_created_at' })
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  /**
   * Data e hora da última atualização do comentário.
   */
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  /**
   * As avaliações detalhadas (limpeza, papel, etc.) associadas a este comentário.
   */
  @OneToOne(() => CommentRateEntity, (rate) => rate.comment, {
    nullable: true,
    mappedBy: 'comment',
  })
  rate?: CommentRateEntity;

  /**
   * Coleção de reações (likes/dislikes) a este comentário.
   */
  @OneToMany(() => ReactEntity, (react) => react.comment)
  reacts: Collection<ReactEntity> = new Collection<ReactEntity>(this);

  /**
   * Coleção de respostas a este comentário.
   */
  @OneToMany(() => ReplyEntity, (reply) => reply.comment)
  replies: Collection<ReplyEntity> = new Collection<ReplyEntity>(this);

  /**
   * Contagem total de respostas a este comentário (calculado).
   */
  @Formula(
    (alias) =>
      `(SELECT COUNT(*) FROM reply r WHERE r.comment_id = ${alias}.id)`,
    { lazy: true },
  )
  replyCount: number = 0;

  /**
   * Contagem total de 'likes' neste comentário (calculado).
   */
  @Formula(
    (alias) =>
      `(SELECT COUNT(*) FROM react r 
      WHERE r.comment_id = ${alias}.id 
      AND r.discriminator = '${ReactDiscriminator.LIKE}')`,
    { lazy: true },
  )
  likes: number = 0;

  /**
   * Contagem total de 'dislikes' neste comentário (calculado).
   */
  @Formula(
    (alias) =>
      `(SELECT COUNT(*) FROM react r 
      WHERE r.comment_id = ${alias}.id 
      AND r.discriminator = '${ReactDiscriminator.DISLIKE}')`,
    { lazy: true },
  )
  dislikes: number = 0;

  /**
   * O utilizador que criou o comentário.
   */
  get user(): UserEntity {
    return this.interaction?.user;
  }

  /**
   * Verdadeiro se o comentário foi marcado como apagado (soft delete).
   */
  get isDeleted(): boolean {
    return !!this.deletedAt && !!this.deletedBy;
  }

  /**
   * Armazena a reação do utilizador que fez a requisição.
   * Preenchido dinamicamente por consulta.
   */
  @Property({ persist: false })
  myReact?: ReactDiscriminator | null;
}
