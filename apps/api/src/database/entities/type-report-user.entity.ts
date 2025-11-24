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
 * Tipos de denúncia para um utilizador.
 */
export enum TypeReportUserApiName {
  /** Assédio ou abuso. */
  HARASSMENT_ABUSE = 'harassment-abuse',
  /** Conta falsa ou fraudulenta. */
  FAKE_ACCOUNT = 'fake-account',
  /** Falsificação de identidade. */
  IMPERSONATION = 'impersonation',
  /** Discurso de ódio ou discriminação. */
  HATE_SPEECH = 'hate-speech',
  /** Violação de privacidade. */
  PRIVACY_VIOLATION = 'privacy-violation',
  /** Spam ou comportamento abusivo. */
  SPAM = 'spam',
  /** Outras razões não listadas. */
  OTHERS = 'others',
}

/**
 * Representa um tipo de denúncia que pode ser feita a um utilizador.
 * @table type_report_user
 */
@Entity({ tableName: 'type_report_user' })
export class TypeReportUserEntity {
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
  @Index({ name: 'idx_type_report_user_api_name' })
  @Unique()
  @Property({ length: 50 })
  apiName!: TypeReportUserApiName;

  /**
   * Coleção de denúncias deste tipo.
   */
  @OneToMany(() => ReportUserEntity, (report) => report.typeReportUser)
  reports: Collection<ReportUserEntity> = new Collection<ReportUserEntity>(
    this,
  );
}
