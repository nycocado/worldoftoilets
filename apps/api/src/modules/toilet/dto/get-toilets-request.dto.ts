import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { AccessApiName, TypeExtraApiName } from '@database/entities';

/**
 * DTO de Request para Obter Toilets
 *
 * @class GetToiletsRequestDto
 * @description Transfer Object para requisição de listagem de toilets ativos com filtros.
 * Permite filtrar por localização, acesso, extras e paginação.
 *
 * @property {boolean} [pageable] - Ativa paginação
 * @property {number} [page] - Número da página (default: 0)
 * @property {number} [size] - Tamanho da página (default: 20)
 * @property {string} [city] - Filtrar por cidade
 * @property {string} [country] - Filtrar por país
 * @property {string} [countryCode] - Filtrar por código ISO do país
 * @property {AccessApiName} [access] - Filtrar por tipo de acesso
 * @property {TypeExtraApiName[]} [extras] - Filtrar por extras (CSV)
 * @property {Date} [timestamp] - Timestamp para cache (default: now)
 *
 * @example
 * {
 *   "pageable": true,
 *   "page": 0,
 *   "size": 20,
 *   "city": "Lisboa",
 *   "country": "Portugal",
 *   "access": "PUBLIC",
 *   "extras": "WIFI,ACCESSIBLE"
 * }
 */
export class GetToiletsRequestDto {
  /**
   * Ativa paginação (opcional)
   *
   * @type {boolean}
   * @description Se true, retorna resultados paginados
   * @example true
   */
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  pageable?: boolean;

  /**
   * Número da página (opcional)
   *
   * @type {number}
   * @description Número da página a retornar (começa em 0)
   * @example 0
   */
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 0;

  /**
   * Tamanho da página (opcional)
   *
   * @type {number}
   * @description Número de itens por página
   * @example 20
   */
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  size?: number = 20;

  /**
   * Filtrar por cidade (opcional)
   *
   * @type {string}
   * @description Nome da cidade para filtrar
   * @example "Lisboa"
   */
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;

  /**
   * Filtrar por país (opcional)
   *
   * @type {string}
   * @description Nome do país para filtrar
   * @example "Portugal"
   */
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  country?: string;

  /**
   * Filtrar por código do país (opcional)
   *
   * @type {string}
   * @description Código ISO 3166-1 alpha-2 do país
   * @example "PT"
   */
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  countryCode?: string;

  /**
   * Filtrar por tipo de acesso (opcional)
   *
   * @type {AccessApiName}
   * @enum {string}
   * @description Tipo de acesso do toilet
   * @example "PUBLIC"
   */
  @ApiProperty({ required: false, enum: AccessApiName })
  @IsOptional()
  @IsEnum(AccessApiName)
  access?: AccessApiName;

  /**
   * Filtrar por extras (opcional)
   *
   * @type {TypeExtraApiName[]}
   * @description Lista de extras separados por vírgula (CSV)
   * @example "WIFI,ACCESSIBLE"
   */
  @ApiProperty({ required: false, enum: TypeExtraApiName, isArray: true })
  @IsOptional()
  @IsEnum(TypeExtraApiName, { each: true })
  @Transform(({ value }) => value.trim().split(','))
  extras?: TypeExtraApiName[];

  /**
   * Timestamp para cache (opcional)
   *
   * @type {Date}
   * @description Timestamp para controle de cache
   * @example "2025-01-15T10:30:00Z"
   */
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  timestamp?: Date = new Date();
}
