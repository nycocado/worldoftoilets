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
import { ToiletEntity } from './toilet.entity';
import { UserEntity } from './user.entity';

/**
 * O status de um parceiro no sistema.
 */
export enum PartnerStatus {
  /** A candidatura está pendente de revisão. */
  PENDING = 'pending',
  /** A parceria está ativa e aprovada. */
  ACTIVE = 'active',
  /** A parceria está inativa ou suspensa. */
  INACTIVE = 'inactive',
  /** A candidatura à parceria foi rejeitada. */
  REJECTED = 'rejected',
}

/**
 * Representa uma parceria entre um utilizador e uma casa de banho.
 * @table partner
 */
@Entity({ tableName: 'partner' })
export class PartnerEntity {
  /**
   * Identificador único interno.
   */
  @PrimaryKey()
  id!: number;

  /**
   * Identificador público (UUID) para partilha externa através da API.
   */
  @Unique()
  @Index({ name: 'idx_partner_public_id' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  publicId!: string;

  /**
   * A casa de banho que pertence a esta parceria.
   */
  @Unique({ name: 'idx_partner_toilet_id' })
  @OneToOne(() => ToiletEntity, {
    owner: true,
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  toilet!: ToiletEntity;

  /**
   * O utilizador que é dono desta parceria.
   */
  @Unique({ name: 'idx_partner_user_id' })
  @OneToOne(() => UserEntity, {
    owner: true,
    deleteRule: 'set null',
    updateRule: 'no action',
    nullable: true,
  })
  user?: UserEntity;

  /**
   * Documento ou número de certificação que comprova a parceria.
   */
  @Property({ length: 255, nullable: true })
  certificate?: string;

  /**
   * E-mail de contacto para assuntos relacionados com a parceria.
   */
  @Index({ name: 'idx_partner_contact_email' })
  @Property({ length: 100 })
  contactEmail!: string;

  /**
   * O status atual da parceria.
   */
  @Index({ name: 'idx_partner_status' })
  @Enum(() => PartnerStatus)
  status!: PartnerStatus;

  /**
   * O administrador que reviu a candidatura de parceria.
   */
  @ManyToOne(() => UserEntity, {
    deleteRule: 'set null',
    updateRule: 'no action',
    nullable: true,
  })
  reviewedBy?: UserEntity;

  /**
   * Data e hora em que a candidatura foi revista.
   */
  @Index({ name: 'idx_partner_reviewed_at' })
  @Property({ nullable: true })
  reviewedAt?: Date;

  /**
   * Data e hora de criação do registo de parceria.
   */
  @Index({ name: 'idx_partner_created_at' })
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  /**
   * Data e hora da última atualização do registo.
   */
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
