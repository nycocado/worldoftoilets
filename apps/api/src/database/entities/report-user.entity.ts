import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { TypeReportUserEntity } from './type-report-user.entity';
import { UserEntity } from './user.entity';

/**
 * Estados possíveis de um relatório sobre utilizador
 */
export enum ReportUserStatus {
  /** Relatório pendente de revisão */
  PENDING = 'pending',
  /** Relatório aceito e ação tomada */
  ACCEPTED = 'accepted',
  /** Relatório rejeitado */
  REJECTED = 'rejected',
}

/**
 * Entidade que representa um relatório sobre um utilizador
 * @table report_user
 * @description Relatório de abuso/comportamento inadequado de um utilizador
 */
@Entity({ tableName: 'report_user' })
export class ReportUserEntity {
  /**
   * ID interno do relatório
   * @field id
   * @type number
   * @nullable false
   * @primary true
   * @description Identificador único interno
   */
  @PrimaryKey()
  id!: number;

  /**
   * ID público em formato UUID
   * @field publicId
   * @type string (UUID)
   * @nullable false
   * @unique true
   * @length 36
   * @default uuid_v4()
   * @description Identificador público para referência externa
   */
  @Unique()
  @Index({ name: 'idx_report_user_public_id' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  publicId!: string;

  /**
   * Tipo do relatório
   * @field typeReportUser
   * @type TypeReportUserEntity
   * @nullable false
   * @relationship many-to-one
   * @description Razão/tipo do reporte (assédio, spam, conteúdo ilegal, etc)
   */
  @Index({ name: 'idx_report_user_type' })
  @ManyToOne(() => TypeReportUserEntity, {
    deleteRule: 'no action',
    updateRule: 'no action',
  })
  typeReportUser!: TypeReportUserEntity;

  /**
   * Utilizador sendo reportado
   * @field userReported
   * @type UserEntity
   * @nullable false
   * @relationship many-to-one
   * @description Usuário alvo do reporte
   */
  @Index({ name: 'idx_report_user_reported' })
  @ManyToOne(() => UserEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  userReported!: UserEntity;

  /**
   * Utilizador que fez o reporte
   * @field userReporter
   * @type UserEntity
   * @nullable false
   * @relationship many-to-one
   * @description Usuário que criou o reporte
   */
  @Index({ name: 'idx_report_user_reporter' })
  @ManyToOne(() => UserEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  userReporter!: UserEntity;

  /**
   * Status atual do relatório
   * @field status
   * @type ReportUserStatus (enum)
   * @nullable false
   * @default PENDING
   * @description PENDING, ACCEPTED ou REJECTED
   */
  @Index({ name: 'idx_report_user_status' })
  @Enum(() => ReportUserStatus)
  @Property({ default: ReportUserStatus.PENDING })
  status: ReportUserStatus = ReportUserStatus.PENDING;

  /**
   * Usuário que revisou o relatório
   * @field reviewedBy
   * @type UserEntity
   * @nullable true
   * @relationship many-to-one
   * @description Moderador que revisou (se aplicável)
   */
  @ManyToOne(() => UserEntity, {
    deleteRule: 'set null',
    updateRule: 'no action',
    nullable: true,
  })
  reviewedBy?: UserEntity;

  /**
   * Timestamp da revisão do relatório
   * @field reviewedAt
   * @type Date
   * @nullable true
   * @description Data/hora de revisão do reporte
   */
  @Index({ name: 'idx_report_user_reviewed_at' })
  @Property({ nullable: true })
  reviewedAt?: Date;

  /**
   * Timestamp de criação do relatório
   * @field createdAt
   * @type Date
   * @nullable false
   * @default now()
   * @description Data/hora de criação do reporte
   */
  @Index({ name: 'idx_report_user_created_at' })
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  /**
   * Timestamp da última atualização
   * @field updatedAt
   * @type Date
   * @nullable false
   * @default now()
   * @description Data/hora da última modificação
   */
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
