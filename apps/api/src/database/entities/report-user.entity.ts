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
 * O status de uma denúncia de utilizador.
 */
export enum ReportUserStatus {
  /** A denúncia está pendente de revisão. */
  PENDING = 'pending',
  /** A denúncia foi aceite e uma ação foi tomada. */
  ACCEPTED = 'accepted',
  /** A denúncia foi rejeitada. */
  REJECTED = 'rejected',
}

/**
 * Representa uma denúncia feita sobre um utilizador.
 * @table report_user
 */
@Entity({ tableName: 'report_user' })
export class ReportUserEntity {
  /**
   * Identificador único interno.
   */
  @PrimaryKey()
  id!: number;

  /**
   * Identificador público (UUID) para partilha externa através da API.
   */
  @Unique()
  @Index({ name: 'idx_report_user_public_id' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  publicId!: string;

  /**
   * O tipo de denúncia.
   */
  @Index({ name: 'idx_report_user_type' })
  @ManyToOne(() => TypeReportUserEntity, {
    deleteRule: 'no action',
    updateRule: 'no action',
  })
  typeReportUser!: TypeReportUserEntity;

  /**
   * O utilizador que foi denunciado.
   */
  @Index({ name: 'idx_report_user_reported' })
  @ManyToOne(() => UserEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  userReported!: UserEntity;

  /**
   * O utilizador que fez a denúncia.
   */
  @Index({ name: 'idx_report_user_reporter' })
  @ManyToOne(() => UserEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  userReporter!: UserEntity;

  /**
   * O status atual da denúncia.
   */
  @Index({ name: 'idx_report_user_status' })
  @Enum(() => ReportUserStatus)
  @Property({ default: ReportUserStatus.PENDING })
  status: ReportUserStatus = ReportUserStatus.PENDING;

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
  @Index({ name: 'idx_report_user_reviewed_at' })
  @Property({ nullable: true })
  reviewedAt?: Date;

  /**
   * Data e hora de criação da denúncia.
   */
  @Index({ name: 'idx_report_user_created_at' })
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  /**
   * Data e hora da última atualização da denúncia.
   */
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
