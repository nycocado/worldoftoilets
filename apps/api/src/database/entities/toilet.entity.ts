import {
  Collection,
  Entity,
  Enum,
  Index,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { CityEntity } from './city.entity';
import { AccessEntity } from './access.entity';
import { UserEntity } from './user.entity';
import { ExtraEntity } from './extra.entity';
import { InteractionEntity } from './interaction.entity';
import { PartnerEntity } from './partner.entity';
import { Point } from '@common/types/point.types';
import { PointType } from '@common/types/point-type.types';

/**
 * Estados possíveis de uma casa de banho no sistema
 */
export enum ToiletStatus {
  /** Casa de banho ativa e pública */
  ACTIVE = 'active',
  /** Casa de banho inativa (temporário ou permanente) */
  INACTIVE = 'inactive',
  /** Casa de banho sugerida, mas não yet aprovada */
  SUGGESTED = 'suggested',
  /** Casa de banho com sugestão rejeitada */
  REJECTED = 'rejected',
}

/**
 * Entidade que representa uma casa de banho pública
 * @table toilet
 * @description Casa de banho pública registada no sistema com geolocalização
 */
@Entity({ tableName: 'toilet' })
export class ToiletEntity {
  /**
   * ID interno da casa de banho
   * @field id
   * @type number
   * @nullable false
   * @primary true
   * @hidden true
   * @description Identificador único interno (não exposto na API)
   */
  @PrimaryKey({ hidden: true })
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
  @Index({ name: 'idx_toilet_public_id' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  publicId!: string;

  /**
   * Cidade onde a casa de banho está localizada
   * @field city
   * @type CityEntity
   * @nullable false
   * @relationship many-to-one
   * @description Cidade/localização geográfica principal
   */
  @Index({ name: 'idx_toilet_city_id' })
  @ManyToOne(() => CityEntity, {
    deleteRule: 'no action',
    updateRule: 'no action',
  })
  city!: CityEntity;

  /**
   * Tipo de acesso da casa de banho
   * @field access
   * @type AccessEntity
   * @nullable false
   * @relationship many-to-one
   * @description Tipo de acesso (público/privado/consumidores-only)
   */
  @Index({ name: 'idx_toilet_access_id' })
  @ManyToOne(() => AccessEntity, {
    deleteRule: 'no action',
    updateRule: 'no action',
  })
  access!: AccessEntity;

  /**
   * Nome da casa de banho
   * @field name
   * @type string
   * @nullable false
   * @length 50
   * @description Nome/identificação local (ex: "Casa de Banho do Centro Comercial")
   */
  @Property({ length: 50 })
  name!: string;

  /**
   * Coordenadas geográficas da casa de banho
   * @field coordinates
   * @type string
   * @nullable false
   * @type point (PostGIS)
   * @description Coordenadas latitude/longitude em formato PostGIS point
   */
  @Property({ columnType: 'point', type: PointType })
  coordinates!: Point;

  /**
   * Morada completa da casa de banho
   * @field address
   * @type string
   * @nullable false
   * @length 255
   * @description Endereço completo para referência
   */
  @Property({ length: 255 })
  address!: string;

  /**
   * URL da foto da casa de banho
   * @field photoUrl
   * @type string
   * @nullable true
   * @length 255
   * @description Link para foto/imagem do local
   */
  @Property({ length: 255, nullable: true })
  photoUrl?: string;

  /**
   * ID do local no Google Places
   * @field placeId
   * @type string
   * @nullable true
   * @unique true
   * @length 255
   * @description Identificador externo para rastreamento de origem
   */
  @Unique()
  @Index({ name: 'idx_toilet_place_id' })
  @Property({ length: 255, nullable: true })
  placeId?: string;

  /**
   * Status atual da casa de banho
   * @field status
   * @type ToiletStatus (enum)
   * @nullable false
   * @description ACTIVE, INACTIVE, SUGGESTED ou REJECTED
   */
  @Index({ name: 'idx_toilet_status' })
  @Enum(() => ToiletStatus)
  status!: ToiletStatus;

  /**
   * Utilizador que reviu/aprovou a casa de banho
   * @field reviewedBy
   * @type UserEntity
   * @nullable true
   * @relationship many-to-one
   * @description Admin que reviu/aprovou o registo
   */
  @ManyToOne(() => UserEntity, {
    deleteRule: 'set null',
    updateRule: 'no action',
    nullable: true,
  })
  reviewedBy?: UserEntity;

  /**
   * Timestamp da revisão/aprovação
   * @field reviewedAt
   * @type Date
   * @nullable true
   * @description Data/hora de revisão/aprovação
   */
  @Index({ name: 'idx_toilet_reviewed_at' })
  @Property({ nullable: true })
  reviewedAt?: Date;

  /**
   * Utilizador que apagou a casa de banho
   * @field deletedBy
   * @type UserEntity
   * @nullable true
   * @relationship many-to-one
   * @description Admin que apagou (soft delete)
   */
  @ManyToOne(() => UserEntity, {
    deleteRule: 'set null',
    updateRule: 'no action',
    nullable: true,
  })
  deletedBy?: UserEntity;

  /**
   * Timestamp da exclusão da casa de banho
   * @field deletedAt
   * @type Date
   * @nullable true
   * @description Data/hora de exclusão (soft delete)
   */
  @Property({ nullable: true })
  deletedAt?: Date;

  /**
   * Timestamp de criação da casa de banho
   * @field createdAt
   * @type Date
   * @nullable false
   * @default now()
   * @description Data/hora de criação do registo
   */
  @Index({ name: 'idx_toilet_created_at' })
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

  /**
   * Coleção de recursos extras disponíveis
   * @field extras
   * @type Collection<ExtraEntity>
   * @relationship one-to-many
   * @description Amenidades/recursos (wifi, pias, espelho, etc)
   */
  @OneToMany(() => ExtraEntity, (extra) => extra.toilet)
  extras: Collection<ExtraEntity> = new Collection<ExtraEntity>(this);

  /**
   * Coleção de interações
   * @field interactions
   * @type Collection<InteractionEntity>
   * @relationship one-to-many
   * @description Comentários, relatórios, sugestões, visualizações
   */
  @OneToMany(() => InteractionEntity, (interaction) => interaction.toilet)
  interactions: Collection<InteractionEntity> =
    new Collection<InteractionEntity>(this);

  /**
   * Parceiro que administra esta casa de banho
   * @field partner
   * @type PartnerEntity
   * @nullable true
   * @relationship one-to-one
   * @description Empresa/pessoa responsável (opcional)
   */
  @OneToOne(() => PartnerEntity, (partner) => partner.toilet, {
    nullable: true,
  })
  partner?: PartnerEntity;

  /**
   * Extrai a longitude das coordenadas
   * @returns Longitude extraída do campo POINT
   * @description Parse do formato POINT(longitude latitude) do MariaDB
   */
  get longitude(): number {
    return this.coordinates.longitude;
  }

  /**
   * Extrai a latitude das coordenadas
   * @returns Latitude extraída do campo POINT
   * @description Parse do formato POINT(longitude latitude) do MariaDB
   */
  get latitude(): number {
    return this.coordinates.latitude;
  }
}
