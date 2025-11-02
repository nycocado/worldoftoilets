import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { TypeReportUserEntity } from './type-report-user.entity';
import { UserEntity } from './user.entity';

export enum ReportUserStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity({ tableName: 'report_user' })
export class ReportUserEntity {
  @PrimaryKey()
  id!: number;

  @Unique()
  @Index({ name: 'idx_report_user_public_id' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  publicId!: string;

  @Index({ name: 'idx_report_user_type' })
  @ManyToOne(() => TypeReportUserEntity, {
    deleteRule: 'no action',
    updateRule: 'no action',
  })
  typeReportUser!: TypeReportUserEntity;

  @Index({ name: 'idx_report_user_reported' })
  @ManyToOne(() => UserEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  userReported!: UserEntity;

  @Index({ name: 'idx_report_user_reporter' })
  @ManyToOne(() => UserEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  userReporter!: UserEntity;

  @Index({ name: 'idx_report_user_status' })
  @Enum(() => ReportUserStatus)
  @Property({ default: ReportUserStatus.PENDING })
  status: ReportUserStatus = ReportUserStatus.PENDING;

  @ManyToOne(() => UserEntity, {
    deleteRule: 'set null',
    updateRule: 'no action',
    nullable: true,
  })
  reviewedBy?: UserEntity;

  @Index({ name: 'idx_report_user_reviewed_at' })
  @Property({ nullable: true })
  reviewedAt?: Date;

  @Index({ name: 'idx_report_user_created_at' })
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
