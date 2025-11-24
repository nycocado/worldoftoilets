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
 * O status de uma denúncia de casa de banho.
 */
export enum ReportToiletStatus {
  /** A denúncia está pendente de revisão. */
  PENDING = 'pending',
  /** A denúncia foi aceite e uma ação foi tomada. */
  ACCEPTED = 'accepted',
  /** A denúncia foi rejeitada. */
  REJECTED = 'rejected',
}

/**
 * Representa uma denúncia feita por um utilizador sobre uma casa de banho.
 * @table report_toilet
 */
@Entity({ tableName: 'report_toilet' })
export class ReportToiletEntity {
  /**
   * Identificador único interno.
   */
  @PrimaryKey()
  id!: number;

  /**
   * Identificador público (UUID) para partilha externa através da API.
   */
  @Unique()
  @Index({ name: 'idx_report_toilet_public_id' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  publicId!: string;

  /**
   * O tipo de denúncia.
   */
  @Index({ name: 'idx_report_toilet_type' })
  @ManyToOne(() => TypeReportToiletEntity, {
    deleteRule: 'no action',
    updateRule: 'no action',
  })
  typeReportToilet!: TypeReportToiletEntity;

  /**
   * A interação que originou esta denúncia.
   */
  @Unique({ name: 'idx_report_toilet_interaction_id' })
  @OneToOne(() => InteractionEntity, {
    owner: true,
    deleteRule: 'cascade',
    updateRule: 'no action',
    orphanRemoval: true,
  })
  interaction!: InteractionEntity;

  /**
   * O status atual da denúncia.
   */
  @Index({ name: 'idx_report_toilet_status' })
  @Enum(() => ReportToiletStatus)
  @Property({ default: ReportToiletStatus.PENDING })
  status: ReportToiletStatus = ReportToiletStatus.PENDING;

  /**
   * O administrador que reviu a denúncia.
   */
  @ManyToOne(() => UserEntity, {
    deleteRule: 'set null',
    updateRule: 'no action',
    nullable: true,
  })
  reviewedBy?: UserEntity;

  /**
   * Data e hora em que a denúncia foi revista.
   */
  @Index({ name: 'idx_report_toilet_reviewed_at' })
  @Property({ nullable: true })
  reviewedAt?: Date;

  /**
   * Data e hora de criação da denúncia.
   */
  @Index({ name: 'idx_report_toilet_created_at' })
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  /**
   * Data e hora da última atualização da denúncia.
   */
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
