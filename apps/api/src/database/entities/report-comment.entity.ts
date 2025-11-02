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

export enum ReportCommentStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity({ tableName: 'report_comment' })
export class ReportCommentEntity {
  @PrimaryKey()
  id!: number;

  @Unique()
  @Index({ name: 'idx_report_comment_public_id' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  publicId!: string;

  @Index({ name: 'idx_report_comment_type_id' })
  @ManyToOne(() => TypeReportCommentEntity, {
    deleteRule: 'no action',
    updateRule: 'no action',
  })
  typeReportComment!: TypeReportCommentEntity;

  @Index({ name: 'idx_report_comment_react_id' })
  @ManyToOne(() => ReactEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  react!: ReactEntity;

  @Index({ name: 'idx_report_comment_status' })
  @Enum(() => ReportCommentStatus)
  @Property({ default: ReportCommentStatus.PENDING })
  status: ReportCommentStatus = ReportCommentStatus.PENDING;

  @ManyToOne(() => UserEntity, {
    deleteRule: 'set null',
    updateRule: 'no action',
    nullable: true,
  })
  reviewedBy?: UserEntity;

  @Index({ name: 'idx_report_comment_reviewed_at' })
  @Property({ nullable: true })
  reviewedAt?: Date;

  @Index({ name: 'idx_report_comment_created_at' })
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
