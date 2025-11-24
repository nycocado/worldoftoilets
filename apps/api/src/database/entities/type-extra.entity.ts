import {
  Entity,
  Index,
  PrimaryKey,
  Property,
  Unique,
  Collection,
  ManyToMany,
} from '@mikro-orm/core';
import { ExtraEntity } from './extra.entity';
import { ToiletEntity } from '@database/entities/toilet.entity';

/**
 * Tipos de recursos extras que uma casa de banho pode ter.
 */
export enum TypeExtraApiName {
  /** Acessibilidade para cadeirantes. */
  WHEELCHAIR_ACCESSIBLE = 'wheelchair-accessible',
  /** Trocador de fraldas. */
  BABY_CHANGING_STATION = 'baby-changing-station',
  /** Estacionamento para deficientes. */
  DISABLED_PARKING = 'disabled-parking',
  /** Acessibilidade para pessoas com deficiência visual. */
  ACCESSIBLE_FOR_VISUALLY_IMPAIRED = 'accessible-for-visually-impaired',
}

/**
 * Representa um tipo de recurso extra que pode ser associado a uma casa de banho.
 * @table type_extra
 */
@Entity({ tableName: 'type_extra' })
export class TypeExtraEntity {
  /**
   * Identificador único interno.
   */
  @PrimaryKey()
  id!: number;

  /**
   * Nome legível do tipo de recurso.
   */
  @Property({ length: 50 })
  name!: string;

  /**
   * Identificador único do tipo para uso na API.
   */
  @Index({ name: 'idx_type_extra_api_name' })
  @Unique()
  @Property({ length: 50 })
  apiName!: TypeExtraApiName;

  /**
   * Coleção de casas de banho que possuem este tipo de recurso.
   */
  @ManyToMany({
    entity: () => ToiletEntity,
    mappedBy: (toilet) => toilet.extras,
    pivotEntity: () => ExtraEntity,
  })
  toilets: Collection<ToiletEntity> = new Collection<ToiletEntity>(this);
}
