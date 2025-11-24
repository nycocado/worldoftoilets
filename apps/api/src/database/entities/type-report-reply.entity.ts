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
 * Tipos de denúncia para uma resposta.
 */
export enum TypeReportReplyApiName {
  /** A resposta não é útil ou relevante. */
  NOT_USEFUL = 'not-useful',
  /** A resposta contém informação falsa. */
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
 * Representa um tipo de denúncia que pode ser feita a uma resposta.
 * @table type_report_reply
 */
@Entity({ tableName: 'type_report_reply' })
export class TypeReportReplyEntity {
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
  @Index({ name: 'idx_type_report_reply_api_name' })
  @Unique()
  @Property({ length: 50 })
  apiName!: TypeReportReplyApiName;

  /**
   * Coleção de denúncias deste tipo.
   */
  @OneToMany(() => ReportReplyEntity, (report) => report.typeReportReply)
  reports: Collection<ReportReplyEntity> = new Collection<ReportReplyEntity>(
    this,
  );
}
