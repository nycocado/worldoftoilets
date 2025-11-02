import { Entity, Index, PrimaryKey, Property, Unique } from '@mikro-orm/core';

export enum AccessApiName {
  PUBLIC = 'public',
  PRIVATE = 'private',
  CONSUMERS_ONLY = 'consumers-only',
}

@Entity({ tableName: 'access' })
export class AccessEntity {
  @PrimaryKey()
  id!: number;

  @Property({ length: 50 })
  name!: string;

  @Index({ name: 'idx_access_api_name' })
  @Unique()
  @Property({ length: 50 })
  apiName!: AccessApiName;
}
