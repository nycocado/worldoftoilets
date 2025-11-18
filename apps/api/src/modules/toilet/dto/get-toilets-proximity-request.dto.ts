import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { AccessApiName, TypeExtraApiName } from '@database/entities';

/**
 * DTO de Request para Obter Toilets por Proximidade
 *
 * @class GetToiletsProximityRequestDto
 * @description Transfer Object para requisição de toilets ordenados por distância de um ponto.
 * Retorna toilets mais próximos de uma coordenada específica.
 *
 * @property {number} lat - Latitude de referência
 * @property {number} lng - Longitude de referência
 * @property {boolean} [pageable] - Ativa paginação (default: true)
 * @property {number} [page] - Número da página (default: 0)
 * @property {number} [size] - Tamanho da página (default: 20)
 * @property {AccessApiName} [access] - Filtrar por tipo de acesso
 * @property {TypeExtraApiName[]} [extras] - Filtrar por extras (CSV)
 * @property {Date} [timestamp] - Timestamp para cache (default: now)
 *
 * @example
 * {
 *   "lat": 38.7223,
 *   "lng": -9.1393,
 *   "pageable": true,
 *   "page": 0,
 *   "size": 20,
 *   "access": "PUBLIC"
 * }
 */
export class GetToiletsProximityRequestDto {
  /**
   * Latitude de referência
   *
   * @type {number}
   * @range -90 to 90
   * @description Latitude do ponto de referência para busca por proximidade
   * @example 38.7223
   */
  @ApiProperty()
  @IsNumber()
  @IsLatitude()
  @Type(() => Number)
  lat!: number;

  /**
   * Longitude de referência
   *
   * @type {number}
   * @range -180 to 180
   * @description Longitude do ponto de referência para busca por proximidade
   * @example -9.1393
   */
  @ApiProperty()
  @IsNumber()
  @IsLongitude()
  @Type(() => Number)
  lng!: number;

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
  pageable?: boolean = true;

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
