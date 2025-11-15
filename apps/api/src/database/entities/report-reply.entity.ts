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
 * Estados possíveis de um relatório sobre resposta
 */
export enum ReportReplyStatus {
  /** Relatório pendente de revisão */
  PENDING = 'pending',
  /** Relatório aceito e ação tomada */
  ACCEPTED = 'accepted',
  /** Relatório rejeitado */
  REJECTED = 'rejected',
}

/**
 * Entidade que representa um relatório sobre uma resposta
 * @table report_reply
 * @description Relatório de abuso/problema numa resposta específica
 */
@Entity({ tableName: 'report_reply' })
export class ReportReplyEntity {
  /**
   * ID interno do relatório
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
  @Index({ name: 'idx_report_reply_public_id' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  publicId!: string;

  /**
   * Tipo do relatório
   * @field typeReportReply
   * @type TypeReportReplyEntity
   * @nullable false
   * @relationship many-to-one
   * @description Razão/tipo do reporte (spam, ofensivo, etc)
   */
  @Index({ name: 'idx_report_reply_type_id' })
  @ManyToOne(() => TypeReportReplyEntity, {
    deleteRule: 'no action',
    updateRule: 'no action',
  })
  typeReportReply!: TypeReportReplyEntity;

  /**
   * Resposta que está a ser reportada
   * @field reply
   * @type ReplyEntity
   * @nullable false
   * @relationship many-to-one
   * @description Resposta alvo do reporte
   */
  @Index({ name: 'idx_report_reply_reply_id' })
  @ManyToOne(() => ReplyEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  reply!: ReplyEntity;

  /**
   * Usuário que criou o relatório
   * @field user
   * @type UserEntity
   * @nullable false
   * @relationship many-to-one
   * @description Usuário que reportou a resposta
   */
  @Index({ name: 'idx_report_reply_user_id' })
  @ManyToOne(() => UserEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  user!: UserEntity;

  /**
   * Status atual do relatório
   * @field status
   * @type ReportReplyStatus (enum)
   * @nullable false
   * @default PENDING
   * @description PENDING, ACCEPTED ou REJECTED
   */
  @Index({ name: 'idx_report_reply_status' })
  @Enum(() => ReportReplyStatus)
  @Property({ default: ReportReplyStatus.PENDING })
  status: ReportReplyStatus = ReportReplyStatus.PENDING;

  /**
   * Usuário que revisou o relatório
   * @field reviewedBy
   * @type UserEntity
   * @nullable true
   * @relationship many-to-one
   * @description Moderador que revisou (se aplicável)
   */
  @ManyToOne(() => UserEntity, {
    deleteRule: 'set null',
    updateRule: 'no action',
    nullable: true,
  })
  reviewedBy?: UserEntity;

  /**
   * Timestamp da revisão do relatório
   * @field reviewedAt
   * @type Date
   * @nullable true
   * @description Data/hora de revisão do reporte
   */
  @Index({ name: 'idx_report_reply_reviewed_at' })
  @Property({ nullable: true })
  reviewedAt?: Date;

  /**
   * Timestamp de criação do relatório
   * @field createdAt
   * @type Date
   * @nullable false
   * @default now()
   * @description Data/hora de criação do reporte
   */
  @Index({ name: 'idx_report_reply_created_at' })
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
