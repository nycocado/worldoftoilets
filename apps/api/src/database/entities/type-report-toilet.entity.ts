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

/**
 * Tipos de denúncia para uma casa de banho.
 */
export enum TypeReportToiletApiName {
  /** A informação sobre a casa de banho está incorreta. */
  FAKE_INFORMATION = 'fake-information',
  /** Más condições de higiene. */
  UNSANITARY_CONDITIONS = 'unsanitary-conditions',
  /** Violação de privacidade. */
  PRIVACY_VIOLATION = 'privacy-violation',
  /** Necessita de manutenção ou reparo. */
  MAINTENANCE_NEEDED = 'maintenance-needed',
  /** Equipamento danificado. */
  DAMAGED_EQUIPMENT = 'damaged-equipment',
  /** Outras razões não listadas. */
  OTHERS = 'others',
}

/**
 * Representa um tipo de denúncia que pode ser feita a uma casa de banho.
 * @table type_report_toilet
 */
@Entity({ tableName: 'type_report_toilet' })
export class TypeReportToiletEntity {
  /**
   * Identificador único interno.
   */
  @PrimaryKey()
  id!: number;

  /**
   * Nome legível do tipo de denúncia.
   */
  @Property({ length: 50 })
  name!: string;

  /**
   * Identificador único do tipo para uso na API.
   */
  @Index({ name: 'idx_type_report_toilet_api_name' })
  @Unique()
  @Property({ length: 50 })
  apiName!: TypeReportToiletApiName;

  /**
   * Coleção de denúncias deste tipo.
   */
  @OneToMany(() => ReportToiletEntity, (report) => report.typeReportToilet)
  reports: Collection<ReportToiletEntity> = new Collection<ReportToiletEntity>(
    this,
  );
}
