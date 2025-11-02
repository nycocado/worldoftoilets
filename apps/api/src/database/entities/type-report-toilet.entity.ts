import {
  Entity,
  Index,
  PrimaryKey,
  Property,
  Unique,
  Collection,
  OneToMany,
} from '@mikro-orm/core';
import { ReportToiletEntity } from './report-toilet.entity';

export enum TypeReportToiletApiName {
  FAKE_INFORMATION = 'fake-information',
  UNSANITARY_CONDITIONS = 'unsanitary-conditions',
  PRIVACY_VIOLATION = 'privacy-violation',
  MAINTENANCE_NEEDED = 'maintenance-needed',
  DAMAGED_EQUIPMENT = 'damaged-equipment',
  OTHERS = 'others',
}

@Entity({ tableName: 'type_report_toilet' })
export class TypeReportToiletEntity {
  @PrimaryKey()
  id!: number;

  @Property({ length: 50 })
  name!: string;

  @Index({ name: 'idx_type_report_toilet_api_name' })
  @Unique()
  @Property({ length: 50 })
  apiName!: TypeReportToiletApiName;

  @OneToMany(() => ReportToiletEntity, (report) => report.typeReportToilet)
  reports = new Collection<ReportToiletEntity>(this);
}
