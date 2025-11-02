import {
  Entity,
  Index,
  PrimaryKey,
  Property,
  Unique,
  Collection,
  OneToMany,
} from '@mikro-orm/core';
import { ReportUserEntity } from './report-user.entity';

export enum TypeReportUserApiName {
  HARASSMENT_ABUSE = 'harassment-abuse',
  FAKE_ACCOUNT = 'fake-account',
  IMPERSONATION = 'impersonation',
  HATE_SPEECH = 'hate-speech',
  PRIVACY_VIOLATION = 'privacy-violation',
  SPAM = 'spam',
  OTHERS = 'others',
}

@Entity({ tableName: 'type_report_user' })
export class TypeReportUserEntity {
  @PrimaryKey()
  id!: number;

  @Property({ length: 50 })
  name!: string;

  @Index({ name: 'idx_type_report_user_api_name' })
  @Unique()
  @Property({ length: 50 })
  apiName!: TypeReportUserApiName;

  @OneToMany(() => ReportUserEntity, (report) => report.typeReportUser)
  reports = new Collection<ReportUserEntity>(this);
}
