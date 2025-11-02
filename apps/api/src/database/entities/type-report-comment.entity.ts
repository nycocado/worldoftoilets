import {
  Entity,
  Index,
  PrimaryKey,
  Property,
  Unique,
  Collection,
  OneToMany,
} from '@mikro-orm/core';
import { ReportCommentEntity } from './report-comment.entity';

export enum TypeReportCommentApiName {
  NOT_USEFUL = 'not-useful',
  FAKE_INFORMATION = 'fake-information',
  INAPPROPRIATE_CONTENT = 'inappropriate-content',
  OFFENSIVE_CONTENT = 'offensive-content',
  SPAM = 'spam',
  OTHERS = 'others',
}

@Entity({ tableName: 'type_report_comment' })
export class TypeReportCommentEntity {
  @PrimaryKey()
  id!: number;

  @Property({ length: 50 })
  name!: string;

  @Index({ name: 'idx_type_report_comment_api_name' })
  @Unique()
  @Property({ length: 50 })
  apiName!: TypeReportCommentApiName;

  @OneToMany(() => ReportCommentEntity, (report) => report.typeReportComment)
  reports = new Collection<ReportCommentEntity>(this);
}
