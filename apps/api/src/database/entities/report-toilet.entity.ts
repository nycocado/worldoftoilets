import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { TypeReportToiletEntity } from './type-report-toilet.entity';
import { InteractionEntity } from './interaction.entity';
import { UserEntity } from './user.entity';

/**
 * Estados possíveis de um relatório sobre casa de banho
 */
export enum ReportToiletStatus {
  /** Relatório pendente de revisão */
  PENDING = 'pending',
  /** Relatório aceito e ação tomada */
  ACCEPTED = 'accepted',
  /** Relatório rejeitado */
  REJECTED = 'rejected',
}

/**
 * Entidade que representa um relatório sobre uma casa de banho
 * @table report_toilet
 * @description Relatório de problema/abuso relacionado a uma casa de banho
 */
@Entity({ tableName: 'report_toilet' })
export class ReportToiletEntity {
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
  @Index({ name: 'idx_report_toilet_public_id' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  publicId!: string;

  /**
   * Tipo do relatório
   * @field typeReportToilet
   * @type TypeReportToiletEntity
   * @nullable false
   * @relationship many-to-one
   * @description Razão/tipo do reporte (fechada, suja, falsa, etc)
   */
  @Index({ name: 'idx_report_toilet_type' })
  @ManyToOne(() => TypeReportToiletEntity, {
    deleteRule: 'no action',
    updateRule: 'no action',
  })
  typeReportToilet!: TypeReportToiletEntity;

  /**
   * Interação base associada ao relatório
   * @field interaction
   * @type InteractionEntity
   * @nullable false
   * @relationship one-to-one
   * @unique true
   * @description Interação que originou este reporte
   */
  @Unique({ name: 'idx_report_toilet_interaction_unique' })
  @OneToOne(() => InteractionEntity, {
    owner: true,
    deleteRule: 'cascade',
    updateRule: 'no action',
    orphanRemoval: true,
  })
  interaction!: InteractionEntity;

  /**
   * Status atual do relatório
   * @field status
   * @type ReportToiletStatus (enum)
   * @nullable false
   * @default PENDING
   * @description PENDING, ACCEPTED ou REJECTED
   */
  @Index({ name: 'idx_report_toilet_status' })
  @Enum(() => ReportToiletStatus)
  @Property({ default: ReportToiletStatus.PENDING })
  status: ReportToiletStatus = ReportToiletStatus.PENDING;

  /**
   * Usuário que revisou o relatório
   * @field reviewedBy
   * @type UserEntity
   * @nullable true
   * @relationship many-to-one
   * @description Admin que revisou (se aplicável)
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
  @Index({ name: 'idx_report_toilet_reviewed_at' })
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
  @Index({ name: 'idx_report_toilet_created_at' })
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
