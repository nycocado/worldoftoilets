import {
  Collection,
  Entity,
  Index,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { CityEntity } from '@database/entities/city.entity';

/**
 * Países disponíveis no sistema World of Toilets
 */
export enum CountryApiName {
  PORTUGAL = 'portugal',
  SPAIN = 'spain',
  FRANCE = 'france',
  GERMANY = 'germany',
  ITALY = 'italy',
  BRAZIL = 'brazil',
  UNITED_STATES = 'united-states',
  AUSTRALIA = 'australia',
}

/**
 * Entidade que representa um país onde existem casas de banho cadastradas
 * @table country
 * @description País onde o sistema opera
 */
@Entity({ tableName: 'country' })
export class CountryEntity {
  /**
   * ID interno do país
   * @field id
   * @type number
   * @nullable false
   * @primary true
   * @description Identificador único interno
   */
  @PrimaryKey()
  id!: number;

  /**
   * Nome descritivo do país
   * @field name
   * @type string
   * @nullable false
   * @length 50
   * @description Nome legível do país (ex: "Portugal", "Brasil")
   */
  @Property({ length: 50 })
  name!: string;

  /**
   * Nome único da API para identificar o país
   * @field apiName
   * @type CountryApiName (enum)
   * @nullable false
   * @unique true
   * @length 50
   * @description Identificador da API em kebab-case (ex: "portugal", "united-states")
   */
  @Index({ name: 'idx_country_api_name' })
  @Unique()
  @Property({ length: 50 })
  apiName!: CountryApiName;

  /**
   * Coleção de cidades pertencentes a este país
   * @field cities
   * @type Collection<CityEntity>
   * @relationship one-to-many
   * @description Todas as cidades registradas neste país
   */
  @OneToMany(() => CityEntity, (city) => city.country)
  cities: Collection<CityEntity> = new Collection<CityEntity>(this);
}
