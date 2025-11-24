import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
  Collection,
  OneToMany,
} from '@mikro-orm/core';
import { CommentEntity } from './comment.entity';
import { UserEntity } from './user.entity';
import { ReportReplyEntity } from './report-reply.entity';

/**
 * Estados de visibilidade de uma resposta.
 */
export enum ReplyState {
  /** Visível para todos. */
  VISIBLE = 'visible',
  /** Oculto por moderação ou pelo autor. */
  HIDDEN = 'hidden',
}

/**
 * Representa uma resposta de um utilizador a um comentário.
 * @table reply
 */
@Entity({ tableName: 'reply' })
export class ReplyEntity {
  /**
   * Identificador único interno.
   */
  @PrimaryKey()
  id!: number;

  /**
   * Identificador público (UUID) para partilha externa através da API.
   */
  @Unique()
  @Index({ name: 'idx_reply_public_id' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  publicId!: string;

  /**
   * O comentário ao qual esta resposta pertence.
   */
  @Index({ name: 'idx_reply_comment_id' })
  @ManyToOne(() => CommentEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  comment!: CommentEntity;

  /**
   * O utilizador que criou a resposta.
   */
  @Index({ name: 'idx_reply_user_id' })
  @ManyToOne(() => UserEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  user!: UserEntity;

  /**
   * O conteúdo da resposta, limitado a 280 caracteres.
   */
  @Property({ length: 280 })
  text!: string;

  /**
   * O estado de visibilidade da resposta.
   */
  @Index({ name: 'idx_reply_state' })
  @Enum(() => ReplyState)
  @Property({ default: ReplyState.VISIBLE })
  state: ReplyState = ReplyState.VISIBLE;

  /**
   * O administrador que realizou o soft delete.
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
   * Data e hora de criação da resposta.
   */
  @Index({ name: 'idx_reply_created_at' })
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  /**
   * Data e hora da última atualização da resposta.
   */
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  /**
   * Coleção de denúncias feitas a esta resposta.
   */
  @OneToMany(() => ReportReplyEntity, (report) => report.reply)
  reports: Collection<ReportReplyEntity> = new Collection<ReportReplyEntity>(
    this,
  );
}
