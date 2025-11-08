import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { CountryEntity } from '@database/entities/country.entity';

/**
 * Cidades disponíveis no sistema
 */
export enum CityApiName {
  LISBON = 'lisbon',
  ODIVELAS = 'odivelas',
  LOURES = 'loures',
  PORTO = 'porto',
  BRAGA = 'braga',
  COIMBRA = 'coimbra',
  MADRID = 'madrid',
  BARCELONA = 'barcelona',
  VALENCIA = 'valencia',
  ROME = 'rome',
  MILAN = 'milan',
}

/**
 * Entidade que representa uma cidade
 * @table city
 * @description Cidade onde casas de banho podem estar localizadas
 */
@Entity({ tableName: 'city' })
@Index({
  name: 'idx_city_country_api_name',
  properties: ['country', 'apiName'],
})
@Unique({ properties: ['country', 'apiName'] })
export class CityEntity {
  /**
   * ID interno da cidade
   * @field id
   * @type number
   * @nullable false
   * @primary true
   * @description Identificador único interno (não exposto em API)
   */
  @PrimaryKey()
  id!: number;

  /**
   * País ao qual a cidade pertence
   * @field country
   * @type CountryEntity
   * @nullable false
   * @relationship many-to-one
   * @description Referência ao país pai da cidade
   */
  @ManyToOne(() => CountryEntity, {
    deleteRule: 'no action',
    updateRule: 'no action',
  })
  country!: CountryEntity;

  /**
   * Nome da cidade
   * @field name
   * @type string
   * @nullable false
   * @length 50
   * @description Nome legível da cidade (ex: "Lisboa", "Porto")
   */
  @Property({ length: 50 })
  name!: string;

  /**
   * Nome único da API para identificar a cidade
   * @field apiName
   * @type CityApiName (enum)
   * @nullable false
   * @length 50
   * @unique true (compound com country)
   * @description Identificador da API em kebab-case (ex: "lisbon", "porto")
   */
  @Property({ length: 50 })
  apiName!: CityApiName;
}
