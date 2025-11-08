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
 * Estados possíveis de um parceiro no sistema
 */
export enum PartnerStatus {
  /** Parceiro ativo e aprovado */
  ACTIVE = 'active',
  /** Parceiro inativo ou suspenso */
  INACTIVE = 'inactive',
  /** Parceiro com candidatura rejeitada */
  REJECTED = 'rejected',
}

/**
 * Entidade que representa um parceiro proprietário de uma casa de banho
 * @table partner
 * @description Empresa/pessoa responsável pela administração de uma casa de banho
 */
@Entity({ tableName: 'partner' })
export class PartnerEntity {
  /**
   * ID interno do parceiro
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
  @Index({ name: 'idx_partner_public_id' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  publicId!: string;

  /**
   * Referência à casa de banho administrada pelo parceiro
   * @field toilet
   * @type ToiletEntity
   * @nullable false
   * @relationship one-to-one
   * @unique true
   * @description Casa de banho proprietária (1:1)
   */
  @Unique({ name: 'idx_partner_toilet_id' })
  @OneToOne(() => ToiletEntity, {
    owner: true,
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  toilet!: ToiletEntity;

  /**
   * Referência ao utilizador que é proprietário
   * @field user
   * @type UserEntity
   * @nullable true
   * @relationship one-to-one
   * @unique true
   * @description Usuário proprietário (pode ser null se apagado)
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
   * Certificação/documentação do parceiro
   * @field certificate
   * @type string
   * @nullable false
   * @length 255
   * @description Número ou referência de certificação
   */
  @Property({ length: 255 })
  certificate!: string;

  /**
   * Endereço eletrónico de contacto do parceiro
   * @field contactEmail
   * @type string
   * @nullable false
   * @length 100
   * @description Email para contacto sobre a casa de banho
   */
  @Index({ name: 'idx_partner_contact_email' })
  @Property({ length: 100 })
  contactEmail!: string;

  /**
   * Status atual do parceiro
   * @field status
   * @type PartnerStatus (enum)
   * @nullable false
   * @description ACTIVE, INACTIVE ou REJECTED
   */
  @Index({ name: 'idx_partner_status' })
  @Enum(() => PartnerStatus)
  status!: PartnerStatus;

  /**
   * Utilizador que revisou/aprovou a candidatura
   * @field reviewedBy
   * @type UserEntity
   * @nullable true
   * @relationship many-to-one
   * @description Admin que revisou a candidatura do parceiro
   */
  @ManyToOne(() => UserEntity, {
    deleteRule: 'set null',
    updateRule: 'no action',
    nullable: true,
  })
  reviewedBy?: UserEntity;

  /**
   * Timestamp da revisão da candidatura
   * @field reviewedAt
   * @type Date
   * @nullable true
   * @description Data/hora quando foi revista a candidatura
   */
  @Index({ name: 'idx_partner_reviewed_at' })
  @Property({ nullable: true })
  reviewedAt?: Date;

  /**
   * Timestamp de criação do registo de parceiro
   * @field createdAt
   * @type Date
   * @nullable false
   * @default now()
   * @description Data/hora de criação do registo
   */
  @Index({ name: 'idx_partner_created_at' })
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
