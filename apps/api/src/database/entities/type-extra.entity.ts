import {
  Entity,
  Index,
  PrimaryKey,
  Property,
  Unique,
  Collection,
  OneToMany,
} from '@mikro-orm/core';
import { ExtraEntity } from './extra.entity';

/**
 * Tipos de recursos extras disponíveis em casas de banho
 */
export enum TypeExtraApiName {
  /** Acessibilidade para cadeirantes */
  WHEELCHAIR_ACCESSIBLE = 'wheelchair_accessible',
  /** Trocador de fraldas disponível */
  BABY_CHANGING_STATION = 'baby_changing_station',
  /** Estacionamento para deficientes */
  DISABLED_PARKING = 'disabled_parking',
  /** Acessibilidade para pessoas com deficiência visual */
  ACCESSIBLE_FOR_VISUALLY_IMPAIRED = 'accessible_for_visually_impaired',
}

/**
 * Entidade que representa um tipo de recurso extra
 * @table type_extra
 * @description Tipo/categoria de recurso extra disponível em casas de banho
 */
@Entity({ tableName: 'type_extra' })
export class TypeExtraEntity {
  /**
   * ID interno do tipo de extra
   * @field id
   * @type number
   * @nullable false
   * @primary true
   * @description Identificador único interno
   */
  @PrimaryKey()
  id!: number;

  /**
   * Nome descritivo do tipo de extra
   * @field name
   * @type string
   * @nullable false
   * @length 50
   * @description Nome legível (ex: "Cadeira de Rodas Acessível")
   */
  @Property({ length: 50 })
  name!: string;

  /**
   * Nome único da API para identificar o tipo
   * @field apiName
   * @type TypeExtraApiName (enum)
   * @nullable false
   * @unique true
   * @length 50
   * @description Identificador da API em snake_case
   */
  @Index({ name: 'idx_type_extra_api_name' })
  @Unique()
  @Property({ length: 50 })
  apiName!: TypeExtraApiName;

  /**
   * Coleção de extras deste tipo
   * @field extras
   * @type Collection<ExtraEntity>
   * @relationship one-to-many
   * @description Instâncias deste tipo de extra em banheiros específicos
   */
  @OneToMany(() => ExtraEntity, (extra) => extra.typeExtra)
  extras: Collection<ExtraEntity> = new Collection<ExtraEntity>(this);
}
