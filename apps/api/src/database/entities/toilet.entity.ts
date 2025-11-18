import {
  Collection,
  Entity,
  Enum,
  Formula,
  Index,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { AccessEntity } from './access.entity';
import { UserEntity } from './user.entity';
import { ExtraEntity } from './extra.entity';
import {
  InteractionDiscriminator,
  InteractionEntity,
} from './interaction.entity';
import { PartnerEntity } from './partner.entity';
import { CommentState } from '@database/entities/comment.entity';
import { TypeExtraEntity } from '@database/entities/type-extra.entity';

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
   * Latitude da casa de banho
   * @field latitude
   * @type decimal(10,8)
   * @nullable false
   * @description Latitude em formato decimal (-90 a 90)
   */
  @Property({ columnType: 'decimal(10,8)' })
  latitude!: number;

  /**
   * Longitude da casa de banho
   * @field longitude
   * @type decimal(10,8)
   * @nullable false
   * @description Longitude em formato decimal (-180 a 180)
   */
  @Property({ columnType: 'decimal(10,8)' })
  longitude!: number;

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
   * Cidade onde a casa de banho está localizada
   * @field city
   * @type string
   * @nullable false
   * @length 100
   * @description Nome da cidade
   */
  @Property({ length: 100 })
  city!: string;

  /**
   * Estado/província onde a casa de banho está localizada
   * @field state
   * @type string
   * @nullable true
   * @length 100
   * @description Nome do estado ou província (opcional)
   */
  @Property({ length: 100, nullable: true })
  state?: string;

  /**
   * País onde a casa de banho está localizada
   * @field country
   * @type string
   * @nullable false
   * @length 100
   * @description Nome do país
   */
  @Property({ length: 100 })
  country!: string;

  /**
   * Código do país (ISO 3166-1 alpha-2)
   * @field countryCode
   * @type string
   * @nullable false
   * @length 2
   * @description Código de duas letras do país (ex: PT, BR, ES)
   */
  @Property({ length: 2, fieldName: 'country_code' })
  countryCode!: string;

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
   * @type Collection<TypeExtraEntity>
   * @relationship many-to-many
   * @description Amenidades/recursos (wifi, pias, espelho, etc)
   */
  @ManyToMany({
    entity: () => TypeExtraEntity,
    pivotEntity: () => ExtraEntity,
  })
  extras: Collection<TypeExtraEntity> = new Collection<TypeExtraEntity>(this);

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
   * Total de avaliações (ratings) de comentários visíveis
   * @field totalRatings
   * @type number
   * @nullable false
   * @transient true
   * @description Contagem de comment_rate onde o comentário está visível
   */
  @Formula(
    (alias) =>
      `(SELECT COUNT(cr.id) FROM comment_rate cr 
      INNER JOIN comment c ON cr.id = c.id 
      INNER JOIN interaction i ON c.interaction_id = i.id 
      WHERE i.toilet_id = ${alias}.id 
      AND i.discriminator = '${InteractionDiscriminator.COMMENT}'
      AND c.state = '${CommentState.VISIBLE}')`,
    { lazy: true },
  )
  totalRatings: number = 0;

  /**
   * Média da avaliação de limpeza (clean) dos comentários visíveis
   * @field avgClean
   * @type number
   * @nullable false
   * @transient true
   * @description Média de comment_rate.clean onde o comentário está visível
   */
  @Formula(
    (alias) =>
      `(SELECT COALESCE(AVG(cr.clean), 0) FROM comment_rate cr 
      INNER JOIN comment c ON cr.id = c.id
      INNER JOIN interaction i ON c.interaction_id = i.id
      WHERE i.toilet_id = ${alias}.id 
      AND i.discriminator = '${InteractionDiscriminator.COMMENT}'
      AND c.state = '${CommentState.VISIBLE}')`,
    { lazy: true },
  )
  avgClean: number = 0;

  /**
   * Média da avaliação de estrutura (structure) dos comentários visíveis
   * @field avgStructure
   * @type number
   * @nullable false
   * @transient true
   * @description Média de comment_rate.structure onde o comentário está visível
   */
  @Formula(
    (alias) =>
      `(SELECT COALESCE(AVG(cr.structure), 0) FROM comment_rate cr 
      INNER JOIN comment c ON cr.id = c.id
      INNER JOIN interaction i ON c.interaction_id = i.id
      WHERE i.toilet_id = ${alias}.id 
      AND i.discriminator = '${InteractionDiscriminator.COMMENT}'
      AND c.state = '${CommentState.VISIBLE}')`,
    { lazy: true },
  )
  avgStructure: number = 0;

  /**
   * Média da avaliação de acessibilidade (accessibility) dos comentários visíveis
   * @field avgAccessibility
   * @type number
   * @nullable false
   * @transient true
   * @description Média de comment_rate.accessibility onde o comentário está visível
   */
  @Formula(
    (alias) =>
      `(SELECT COALESCE(AVG(cr.accessibility), 0) FROM comment_rate cr 
      INNER JOIN comment c ON cr.id = c.id
      INNER JOIN interaction i ON c.interaction_id = i.id
      WHERE i.toilet_id = ${alias}.id 
      AND i.discriminator = '${InteractionDiscriminator.COMMENT}'
      AND c.state = '${CommentState.VISIBLE}')`,
    { lazy: true },
  )
  avgAccessibility: number = 0;

  /**
   * Média da disponibilidade de papel (paper) dos comentários visíveis
   * @field paperAvailability
   * @type number
   * @nullable false
   * @transient true
   * @description Média de comment_rate.paper (true=1, false=0) onde o comentário está visível
   */
  @Formula(
    (alias) =>
      `(SELECT COALESCE(AVG(CASE WHEN cr.paper = true THEN 1 ELSE 0 END), 0) FROM comment_rate cr
      INNER JOIN comment c ON cr.id = c.id
      INNER JOIN interaction i ON c.interaction_id = i.id
      WHERE i.toilet_id = ${alias}.id 
      AND i.discriminator = '${InteractionDiscriminator.COMMENT}'
      AND c.state = '${CommentState.VISIBLE}')`,
    { lazy: true },
  )
  paperAvailability: number = 0;
}
