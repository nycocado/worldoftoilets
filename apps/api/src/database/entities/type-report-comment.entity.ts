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

/**
 * Tipos de razões para reportar um comentário
 */
export enum TypeReportCommentApiName {
  /** Comentário não é útil ou relevante */
  NOT_USEFUL = 'not-useful',
  /** Comentário contém informação falsa */
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
 * Entidade que representa um tipo de razão para reporte de comentário
 * @table type_report_comment
 * @description Razão/categoria de reporte para comentários (spam, falso, ofensivo, etc)
 */
@Entity({ tableName: 'type_report_comment' })
export class TypeReportCommentEntity {
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
   * @type TypeReportCommentApiName (enum)
   * @nullable false
   * @unique true
   * @length 50
   * @description Identificador da API em kebab-case
   */
  @Index({ name: 'idx_type_report_comment_api_name' })
  @Unique()
  @Property({ length: 50 })
  apiName!: TypeReportCommentApiName;

  /**
   * Coleção de relatórios deste tipo
   * @field reports
   * @type Collection<ReportCommentEntity>
   * @relationship one-to-many
   * @description Todos os relatórios de comentários desta categoria
   */
  @OneToMany(() => ReportCommentEntity, (report) => report.typeReportComment)
  reports: Collection<ReportCommentEntity> =
    new Collection<ReportCommentEntity>(this);
}
