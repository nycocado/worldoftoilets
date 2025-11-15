import {
  Entity,
  Index,
  PrimaryKey,
  Property,
  Unique,
  Collection,
  OneToMany,
} from '@mikro-orm/core';
import { ReportReplyEntity } from './report-reply.entity';

/**
 * Tipos de razões para reportar uma resposta
 */
export enum TypeReportReplyApiName {
  /** Resposta não é útil ou relevante */
  NOT_USEFUL = 'not-useful',
  /** Resposta contém informação falsa */
  FAKE_INFORMATION = 'fake-information',
  /** Conteúdo inadequado ou fora do tópico */
  INAPPROPRIATE_CONTENT = 'inappropriate-content',
  /** Conteúdo ofensivo ou abusivo */
  OFFENSIVE_CONTENT = 'offensive-content',
  /** Mensagem de spam ou publicidade */
  SPAM = 'spam',
  /** Outras razões */
  OTHERS = 'others',
}

/**
 * Entidade que representa um tipo de razão para reporte de resposta
 * @table type_report_reply
 * @description Razão/categoria de reporte para respostas (spam, falso, ofensivo, etc)
 */
@Entity({ tableName: 'type_report_reply' })
export class TypeReportReplyEntity {
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
   * @description Nome legível (ex: "Conteúdo Ofensivo")
   */
  @Property({ length: 50 })
  name!: string;

  /**
   * Nome único da API para identificar o tipo
   * @field apiName
   * @type TypeReportReplyApiName (enum)
   * @nullable false
   * @unique true
   * @length 50
   * @description Identificador da API em kebab-case
   */
  @Index({ name: 'idx_type_report_reply_api_name' })
  @Unique()
  @Property({ length: 50 })
  apiName!: TypeReportReplyApiName;

  /**
   * Coleção de relatórios deste tipo
   * @field reports
   * @type Collection<ReportReplyEntity>
   * @relationship one-to-many
   * @description Todos os relatórios de respostas desta categoria
   */
  @OneToMany(() => ReportReplyEntity, (report) => report.typeReportReply)
  reports: Collection<ReportReplyEntity> =
    new Collection<ReportReplyEntity>(this);
}
