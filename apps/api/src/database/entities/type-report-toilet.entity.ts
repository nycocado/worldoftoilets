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
 * Tipos de razões para reportar uma casa de banho
 */
export enum TypeReportToiletApiName {
  /** Informação sobre a casa de banho está incorreta */
  FAKE_INFORMATION = 'fake-information',
  /** Condições sanitárias más */
  UNSANITARY_CONDITIONS = 'unsanitary-conditions',
  /** Violação de privacidade (câmaras escondidas, etc) */
  PRIVACY_VIOLATION = 'privacy-violation',
  /** Manutenção necessária ou defeitos */
  MAINTENANCE_NEEDED = 'maintenance-needed',
  /** Equipamento danificado */
  DAMAGED_EQUIPMENT = 'damaged-equipment',
  /** Outras razões */
  OTHERS = 'others',
}

/**
 * Entidade que representa um tipo de razão para reporte de casa de banho
 * @table type_report_toilet
 * @description Razão/categoria de reporte para casas de banho (falso, sujo, danificado, etc)
 */
@Entity({ tableName: 'type_report_toilet' })
export class TypeReportToiletEntity {
  /**
   * ID interno do tipo de reporte
   * @field id
   * @type number
   * @nullable false
   * @primary true
   * @description Identificador único interno
   */
  @PrimaryKey()
  id!: number;

  /**
   * Nome descritivo da razão
   * @field name
   * @type string
   * @nullable false
   * @length 50
   * @description Nome legível (ex: "Condições Sanitárias Más")
   */
  @Property({ length: 50 })
  name!: string;

  /**
   * Nome único da API para identificar o tipo
   * @field apiName
   * @type TypeReportToiletApiName (enum)
   * @nullable false
   * @unique true
   * @length 50
   * @description Identificador da API em kebab-case
   */
  @Index({ name: 'idx_type_report_toilet_api_name' })
  @Unique()
  @Property({ length: 50 })
  apiName!: TypeReportToiletApiName;

  /**
   * Coleção de relatórios deste tipo
   * @field reports
   * @type Collection<ReportToiletEntity>
   * @relationship one-to-many
   * @description Todos os relatórios de casas de banho desta categoria
   */
  @OneToMany(() => ReportToiletEntity, (report) => report.typeReportToilet)
  reports: Collection<ReportToiletEntity> = new Collection<ReportToiletEntity>(
    this,
  );
}
