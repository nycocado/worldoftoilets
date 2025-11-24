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
 * O status de uma denúncia de comentário.
 */
export enum ReportCommentStatus {
  /** A denúncia está pendente de revisão. */
  PENDING = 'pending',
  /** A denúncia foi aceite e uma ação foi tomada. */
  ACCEPTED = 'accepted',
  /** A denúncia foi rejeitada. */
  REJECTED = 'rejected',
}

/**
 * Representa uma denúncia feita por um utilizador sobre um comentário.
 * @table report_comment
 */
@Entity({ tableName: 'report_comment' })
export class ReportCommentEntity {
  /**
   * Identificador único interno.
   */
  @PrimaryKey()
  id!: number;

  /**
   * Identificador público (UUID) para partilha externa através da API.
   */
  @Unique()
  @Index({ name: 'idx_report_comment_public_id' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  publicId!: string;

  /**
   * O tipo de denúncia.
   */
  @Index({ name: 'idx_report_comment_type_id' })
  @ManyToOne(() => TypeReportCommentEntity, {
    deleteRule: 'no action',
    updateRule: 'no action',
  })
  typeReportComment!: TypeReportCommentEntity;

  /**
   * A reação que originou esta denúncia.
   */
  @Index({ name: 'idx_report_comment_react_id' })
  @ManyToOne(() => ReactEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  react!: ReactEntity;

  /**
   * O status atual da denúncia.
   */
  @Index({ name: 'idx_report_comment_status' })
  @Enum(() => ReportCommentStatus)
  @Property({ default: ReportCommentStatus.PENDING })
  status: ReportCommentStatus = ReportCommentStatus.PENDING;

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
  @Index({ name: 'idx_report_comment_reviewed_at' })
  @Property({ nullable: true })
  reviewedAt?: Date;

  /**
   * Data e hora de criação da denúncia.
   */
  @Index({ name: 'idx_report_comment_created_at' })
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  /**
   * Data e hora da última atualização da denúncia.
   */
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
