import { Entity, Index, PrimaryKey, Property, Unique } from '@mikro-orm/core';

/**
 * Tipos de acesso disponíveis para uma casa de banho no sistema
 */
export enum AccessApiName {
  /** Casa de banho com acesso público */
  PUBLIC = 'public',
  /** Casa de banho com acesso privado */
  PRIVATE = 'private',
  /** Casa de banho apenas para consumidores */
  CONSUMERS_ONLY = 'consumers-only',
}

/**
 * Entidade que representa um tipo de acesso para casas de banho
 * @table access
 * @description Tipo de acesso para casas de banho (público, privado, consumidores-only)
 */
@Entity({ tableName: 'access' })
export class AccessEntity {
  /**
   * ID interno do tipo de acesso
   * @field id
   * @type number
   * @nullable false
   * @primary true
   * @description Identificador único interno (não exposto em API)
   */
  @PrimaryKey()
  id!: number;

  /**
   * Nome descritivo do tipo de acesso
   * @field name
   * @type string
   * @nullable false
   * @length 50
   * @description Nome legível para exibição (ex: "Público", "Privado")
   */
  @Property({ length: 50 })
  name!: string;

  /**
   * Nome único da API para identificar o tipo de acesso
   * @field apiName
   * @type AccessApiName (enum)
   * @nullable false
   * @unique true
   * @length 50
   * @description Identificador da API seguindo padrão kebab-case (ex: "public", "private")
   */
  @Index({ name: 'idx_access_api_name' })
  @Unique()
  @Property({ length: 50 })
  apiName!: AccessApiName;
}
