import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { TypeReportToiletEntity } from './type-report-toilet.entity';
import { InteractionEntity } from './interaction.entity';
import { UserEntity } from './user.entity';

export enum ReportToiletStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity({ tableName: 'report_toilet' })
export class ReportToiletEntity {
  @PrimaryKey()
  id!: number;

  @Unique()
  @Index({ name: 'idx_report_toilet_public_id' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  publicId!: string;

  @Index({ name: 'idx_report_toilet_type' })
  @ManyToOne(() => TypeReportToiletEntity, {
    deleteRule: 'no action',
    updateRule: 'no action',
  })
  typeReportToilet!: TypeReportToiletEntity;

  @Unique({ name: 'idx_report_toilet_interaction_unique' })
  @OneToOne(() => InteractionEntity, {
    owner: true,
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  interaction!: InteractionEntity;

  @Index({ name: 'idx_report_toilet_status' })
  @Enum(() => ReportToiletStatus)
  @Property({ default: ReportToiletStatus.PENDING })
  status: ReportToiletStatus = ReportToiletStatus.PENDING;

  @ManyToOne(() => UserEntity, {
    deleteRule: 'set null',
    updateRule: 'no action',
    nullable: true,
  })
  reviewedBy?: UserEntity;

  @Index({ name: 'idx_report_toilet_reviewed_at' })
  @Property({ nullable: true })
  reviewedAt?: Date;

  @Index({ name: 'idx_report_toilet_created_at' })
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
