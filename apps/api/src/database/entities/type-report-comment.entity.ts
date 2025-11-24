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
 * Tipos de denúncia para um comentário.
 */
export enum TypeReportCommentApiName {
  /** O comentário não é útil ou relevante. */
  NOT_USEFUL = 'not-useful',
  /** O comentário contém informação falsa. */
  FAKE_INFORMATION = 'fake-information',
  /** O conteúdo é inadequado ou fora do tópico. */
  INAPPROPRIATE_CONTENT = 'inappropriate-content',
  /** O conteúdo é ofensivo ou abusivo. */
  OFFENSIVE_CONTENT = 'offensive-content',
  /** O conteúdo é spam ou publicidade. */
  SPAM = 'spam',
  /** Outras razões não listadas. */
  OTHERS = 'others',
}

/**
 * Representa um tipo de denúncia que pode ser feita a um comentário.
 * @table type_report_comment
 */
@Entity({ tableName: 'type_report_comment' })
export class TypeReportCommentEntity {
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
  @Index({ name: 'idx_type_report_comment_api_name' })
  @Unique()
  @Property({ length: 50 })
  apiName!: TypeReportCommentApiName;

  /**
   * Coleção de denúncias deste tipo.
   */
  @OneToMany(() => ReportCommentEntity, (report) => report.typeReportComment)
  reports: Collection<ReportCommentEntity> =
    new Collection<ReportCommentEntity>(this);
}
