import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { TypeReportReplyEntity } from './type-report-reply.entity';
import { ReplyEntity } from './reply.entity';
import { UserEntity } from './user.entity';

/**
 * O status de uma denúncia de resposta.
 */
export enum ReportReplyStatus {
  /** A denúncia está pendente de revisão. */
  PENDING = 'pending',
  /** A denúncia foi aceite e uma ação foi tomada. */
  ACCEPTED = 'accepted',
  /** A denúncia foi rejeitada. */
  REJECTED = 'rejected',
}

/**
 * Representa uma denúncia feita por um utilizador sobre uma resposta.
 * @table report_reply
 */
@Entity({ tableName: 'report_reply' })
export class ReportReplyEntity {
  /**
   * Identificador único interno.
   */
  @PrimaryKey()
  id!: number;

  /**
   * Identificador público (UUID) para partilha externa através da API.
   */
  @Unique()
  @Index({ name: 'idx_report_reply_public_id' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  publicId!: string;

  /**
   * O tipo de denúncia.
   */
  @Index({ name: 'idx_report_reply_type_id' })
  @ManyToOne(() => TypeReportReplyEntity, {
    deleteRule: 'no action',
    updateRule: 'no action',
  })
  typeReportReply!: TypeReportReplyEntity;

  /**
   * A resposta que foi denunciada.
   */
  @Index({ name: 'idx_report_reply_reply_id' })
  @ManyToOne(() => ReplyEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  reply!: ReplyEntity;

  /**
   * O utilizador que fez a denúncia.
   */
  @Index({ name: 'idx_report_reply_user_id' })
  @ManyToOne(() => UserEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  user!: UserEntity;

  /**
   * O status atual da denúncia.
   */
  @Index({ name: 'idx_report_reply_status' })
  @Enum(() => ReportReplyStatus)
  @Property({ default: ReportReplyStatus.PENDING })
  status: ReportReplyStatus = ReportReplyStatus.PENDING;

  /**
   * O administrador que reviu a denúncia.
   */
  @ManyToOne(() => UserEntity, {
    deleteRule: 'set null',
    updateRule: 'no action',
    nullable: true,
  })
  reviewedBy?: UserEntity;

  /**
   * Data e hora em que a denúncia foi revista.
   */
  @Index({ name: 'idx_report_reply_reviewed_at' })
  @Property({ nullable: true })
  reviewedAt?: Date;

  /**
   * Data e hora de criação da denúncia.
   */
  @Index({ name: 'idx_report_reply_created_at' })
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  /**
   * Data e hora da última atualização da denúncia.
   */
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
