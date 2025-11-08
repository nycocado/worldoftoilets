import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { TypeReportCommentEntity } from './type-report-comment.entity';
import { ReactEntity } from './react.entity';
import { UserEntity } from './user.entity';

/**
 * Estados possíveis de um relatório sobre comentário
 */
export enum ReportCommentStatus {
  /** Relatório pendente de revisão */
  PENDING = 'pending',
  /** Relatório aceito e ação tomada */
  ACCEPTED = 'accepted',
  /** Relatório rejeitado */
  REJECTED = 'rejected',
}

/**
 * Entidade que representa um relatório sobre um comentário
 * @table report_comment
 * @description Relatório de abuso/problema num comentário específico
 */
@Entity({ tableName: 'report_comment' })
export class ReportCommentEntity {
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
  @Index({ name: 'idx_report_comment_public_id' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  publicId!: string;

  /**
   * Tipo do relatório
   * @field typeReportComment
   * @type TypeReportCommentEntity
   * @nullable false
   * @relationship many-to-one
   * @description Razão/tipo do reporte (spam, ofensivo, etc)
   */
  @Index({ name: 'idx_report_comment_type_id' })
  @ManyToOne(() => TypeReportCommentEntity, {
    deleteRule: 'no action',
    updateRule: 'no action',
  })
  typeReportComment!: TypeReportCommentEntity;

  /**
   * Reação que está a ser reportada
   * @field react
   * @type ReactEntity
   * @nullable false
   * @relationship many-to-one
   * @description Reação alvo do reporte
   */
  @Index({ name: 'idx_report_comment_react_id' })
  @ManyToOne(() => ReactEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  react!: ReactEntity;

  /**
   * Status atual do relatório
   * @field status
   * @type ReportCommentStatus (enum)
   * @nullable false
   * @default PENDING
   * @description PENDING, ACCEPTED ou REJECTED
   */
  @Index({ name: 'idx_report_comment_status' })
  @Enum(() => ReportCommentStatus)
  @Property({ default: ReportCommentStatus.PENDING })
  status: ReportCommentStatus = ReportCommentStatus.PENDING;

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
  @Index({ name: 'idx_report_comment_reviewed_at' })
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
  @Index({ name: 'idx_report_comment_created_at' })
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
