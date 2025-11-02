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

export enum TypeExtraApiName {
  WHEELCHAIR_ACCESSIBLE = 'wheelchair_accessible',
  BABY_CHANGING_STATION = 'baby_changing_station',
  DISABLED_PARKING = 'disabled_parking',
  ACCESSIBLE_FOR_VISUALLY_IMPAIRED = 'accessible_for_visually_impaired',
}

@Entity({ tableName: 'type_extra' })
export class TypeExtraEntity {
  @PrimaryKey()
  id!: number;

  @Property({ length: 50 })
  name!: string;

  @Index({ name: 'idx_type_extra_api_name' })
  @Unique()
  @Property({ length: 50 })
  apiName!: TypeExtraApiName;

  @OneToMany(() => ExtraEntity, (extra) => extra.typeExtra)
  extras = new Collection<ExtraEntity>(this);
}
