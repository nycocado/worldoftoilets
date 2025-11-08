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

/**
 * Tipos de razões para reportar um utilizador
 */
export enum TypeReportUserApiName {
  /** Assédio ou abuso de outro utilizador */
  HARASSMENT_ABUSE = 'harassment-abuse',
  /** Conta falsa ou fraudulenta */
  FAKE_ACCOUNT = 'fake-account',
  /** Suplantação de identidade ou impersonação */
  IMPERSONATION = 'impersonation',
  /** Discurso de ódio ou discriminação */
  HATE_SPEECH = 'hate-speech',
  /** Violação de privacidade */
  PRIVACY_VIOLATION = 'privacy-violation',
  /** Spam ou comportamento abusivo */
  SPAM = 'spam',
  /** Outras razões */
  OTHERS = 'others',
}

/**
 * Entidade que representa um tipo de razão para reporte de utilizador
 * @table type_report_user
 * @description Razão/categoria de reporte para utilizadores (assédio, spam, ódio, etc)
 */
@Entity({ tableName: 'type_report_user' })
export class TypeReportUserEntity {
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
   * @description Nome legível (ex: "Assédio ou Abuso")
   */
  @Property({ length: 50 })
  name!: string;

  /**
   * Nome único da API para identificar o tipo
   * @field apiName
   * @type TypeReportUserApiName (enum)
   * @nullable false
   * @unique true
   * @length 50
   * @description Identificador da API em kebab-case
   */
  @Index({ name: 'idx_type_report_user_api_name' })
  @Unique()
  @Property({ length: 50 })
  apiName!: TypeReportUserApiName;

  /**
   * Coleção de relatórios deste tipo
   * @field reports
   * @type Collection<ReportUserEntity>
   * @relationship one-to-many
   * @description Todos os relatórios de utilizadores desta categoria
   */
  @OneToMany(() => ReportUserEntity, (report) => report.typeReportUser)
  reports: Collection<ReportUserEntity> = new Collection<ReportUserEntity>(
    this,
  );
}
