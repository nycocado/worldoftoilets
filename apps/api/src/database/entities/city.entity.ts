import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { CountryEntity } from '@database/entities/country.entity';

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

@Entity({ tableName: 'city' })
@Index({
  name: 'idx_city_country_api_name',
  properties: ['country', 'apiName'],
})
@Unique({ properties: ['country', 'apiName'] })
export class CityEntity {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => CountryEntity, {
    deleteRule: 'no action',
    updateRule: 'no action',
  })
  country!: CountryEntity;

  @Property({ length: 50 })
  name!: string;

  @Property({ length: 50 })
  apiName!: CityApiName;
}
