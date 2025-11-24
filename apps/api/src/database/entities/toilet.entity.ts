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
 * O status de uma casa de banho no sistema.
 */
export enum ToiletStatus {
  /** A casa de banho está ativa e visível para os utilizadores. */
  ACTIVE = 'active',
  /** A casa de banho está inativa e não pode ser acedida. */
  INACTIVE = 'inactive',
  /** A casa de banho foi sugerida mas aguarda aprovação. */
  SUGGESTED = 'suggested',
  /** A sugestão para esta casa de banho foi rejeitada. */
  REJECTED = 'rejected',
}

/**
 * Representa uma casa de banho no sistema.
 * @table toilet
 */
@Entity({ tableName: 'toilet' })
export class ToiletEntity {
  /**
   * Identificador único interno.
   */
  @PrimaryKey({ hidden: true })
  id!: number;

  /**
   * Identificador público (UUID) para partilha externa através da API.
   */
  @Unique()
  @Index({ name: 'idx_toilet_public_id' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  publicId!: string;

  /**
   * O tipo de acesso da casa de banho (público, privado, etc.).
   */
  @Index({ name: 'idx_toilet_access_id' })
  @ManyToOne(() => AccessEntity, {
    deleteRule: 'no action',
    updateRule: 'no action',
  })
  access!: AccessEntity;

  /**
   * Nome local ou designação da casa de banho.
   */
  @Property({ length: 50 })
  name!: string;

  /**
   * A latitude da localização da casa de banho.
   */
  @Property({ columnType: 'decimal(10,8)' })
  latitude!: number;

  /**
   * A longitude da localização da casa de banho.
   */
  @Property({ columnType: 'decimal(10,8)' })
  longitude!: number;

  /**
   * A morada completa da casa de banho.
   */
  @Property({ length: 255 })
  address!: string;

  /**
   * A cidade onde a casa de banho se localiza.
   */
  @Property({ length: 100 })
  city!: string;

  /**
   * O estado ou província onde a casa de banho se localiza.
   */
  @Property({ length: 100, nullable: true })
  state?: string;

  /**
   * O país onde a casa de banho se localiza.
   */
  @Property({ length: 100 })
  country!: string;

  /**
   * O código do país (ISO 3166-1 alpha-2).
   */
  @Property({ length: 2, fieldName: 'country_code' })
  countryCode!: string;

  /**
   * URL de uma foto da casa de banho, se disponível.
   */
  @Property({ length: 255, nullable: true })
  photoUrl?: string;

  /**
   * ID do local no Google Places, se aplicável.
   */
  @Unique()
  @Index({ name: 'idx_toilet_place_id' })
  @Property({ length: 255, nullable: true })
  placeId?: string;

  /**
   * O status atual da casa de banho.
   */
  @Index({ name: 'idx_toilet_status' })
  @Enum(() => ToiletStatus)
  status!: ToiletStatus;

  /**
   * O administrador que reviu e aprovou a casa de banho.
   */
  @ManyToOne(() => UserEntity, {
    deleteRule: 'set null',
    updateRule: 'no action',
    nullable: true,
  })
  reviewedBy?: UserEntity;

  /**
   * Data e hora em que a casa de banho foi revista.
   */
  @Index({ name: 'idx_toilet_reviewed_at' })
  @Property({ nullable: true })
  reviewedAt?: Date;

  /**
   * O administrador que realizou o soft delete.
   */
  @ManyToOne(() => UserEntity, {
    deleteRule: 'set null',
    updateRule: 'no action',
    nullable: true,
  })
  deletedBy?: UserEntity;

  /**
   * Data e hora da exclusão (para soft delete).
   */
  @Property({ nullable: true })
  deletedAt?: Date;

  /**
   * Data e hora de criação do registo.
   */
  @Index({ name: 'idx_toilet_created_at' })
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  /**
   * Data e hora da última atualização do registo.
   */
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  /**
   * Coleção de recursos extras disponíveis nesta casa de banho.
   */
  @ManyToMany({
    entity: () => TypeExtraEntity,
    pivotEntity: () => ExtraEntity,
  })
  extras: Collection<TypeExtraEntity> = new Collection<TypeExtraEntity>(this);

  /**
   * Coleção de todas as interações associadas a esta casa de banho.
   */
  @OneToMany(() => InteractionEntity, (interaction) => interaction.toilet)
  interactions: Collection<InteractionEntity> =
    new Collection<InteractionEntity>(this);

  /**
   * A parceria associada a esta casa de banho, se existir.
   */
  @OneToOne(() => PartnerEntity, (partner) => partner.toilet, {
    nullable: true,
  })
  partner?: PartnerEntity;

  /**
   * Contagem total de avaliações visíveis (calculado).
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
   * Média da avaliação de limpeza de 1 a 5 (calculado).
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
   * Média da avaliação de estrutura de 1 a 5 (calculado).
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
   * Média da avaliação de acessibilidade de 1 a 5 (calculado).
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
   * Percentagem de disponibilidade de papel higiénico (0 a 1, calculado).
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

  /**
   * Verdadeiro se a casa de banho foi marcada como apagada (soft delete).
   */
  get isDeleted(): boolean {
    return !!this.deletedBy && !!this.deletedAt;
  }
}
