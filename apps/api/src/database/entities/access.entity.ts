import { Entity, Index, PrimaryKey, Property, Unique } from '@mikro-orm/core';

/**
 * Tipos de acesso para uma casa de banho.
 */
export enum AccessApiName {
  /** Acesso público. */
  PUBLIC = 'public',
  /** Acesso privado. */
  PRIVATE = 'private',
  /** Acesso restrito a consumidores. */
  CONSUMERS_ONLY = 'consumers-only',
}

/**
 * Representa um tipo de acesso para casas de banho.
 * @table access
 */
@Entity({ tableName: 'access' })
export class AccessEntity {
  /**
   * Identificador único interno.
   */
  @PrimaryKey()
  id!: number;

  /**
   * Nome legível para exibição.
   */
  @Property({ length: 50 })
  name!: string;

  /**
   * Identificador único para uso na API.
   */
  @Index({ name: 'idx_access_api_name' })
  @Unique()
  @Property({ length: 50 })
  apiName!: AccessApiName;
}
