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

@Entity({ tableName: 'country' })
export class CountryEntity {
  @PrimaryKey()
  id!: number;

  @Property({ length: 50 })
  name!: string;

  @Index({ name: 'idx_country_api_name' })
  @Unique()
  @Property({ length: 50 })
  apiName!: CountryApiName;

  @OneToMany(() => CityEntity, (city) => city.country)
  cities = new Collection<CityEntity>(this);
}
