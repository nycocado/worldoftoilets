import { ApiProperty } from '@nestjs/swagger';
import {
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
 * DTO de Request para Obter Toilets por Bounding Box
 *
 * @class GetToiletsBoundingBoxRequestDto
 * @description Transfer Object para requisição de toilets dentro de uma área geográfica retangular.
 * Define área usando coordenadas mínimas e máximas (sudoeste e nordeste).
 *
 * @property {number} minLat - Latitude mínima (canto sudoeste)
 * @property {number} minLng - Longitude mínima (canto sudoeste)
 * @property {number} maxLat - Latitude máxima (canto nordeste)
 * @property {number} maxLng - Longitude máxima (canto nordeste)
 * @property {AccessApiName} [access] - Filtrar por tipo de acesso
 * @property {TypeExtraApiName[]} [extras] - Filtrar por extras (CSV)
 * @property {Date} [timestamp] - Timestamp para cache (default: now)
 *
 * @example
 * {
 *   "minLat": 38.7,
 *   "minLng": -9.2,
 *   "maxLat": 38.8,
 *   "maxLng": -9.1,
 *   "access": "PUBLIC"
 * }
 */
export class GetToiletsBoundingBoxRequestDto {
  /**
   * Latitude mínima (canto sudoeste)
   *
   * @type {number}
   * @range -90 to 90
   * @description Latitude do canto sudoeste da bounding box
   * @example 38.7
   */
  @ApiProperty()
  @IsNumber()
  @IsLatitude()
  @Type(() => Number)
  minLat!: number;

  /**
   * Longitude mínima (canto sudoeste)
   *
   * @type {number}
   * @range -180 to 180
   * @description Longitude do canto sudoeste da bounding box
   * @example -9.2
   */
  @ApiProperty()
  @IsNumber()
  @IsLongitude()
  @Type(() => Number)
  minLng!: number;

  /**
   * Latitude máxima (canto nordeste)
   *
   * @type {number}
   * @range -90 to 90
   * @description Latitude do canto nordeste da bounding box
   * @example 38.8
   */
  @ApiProperty()
  @IsNumber()
  @IsLatitude()
  @Type(() => Number)
  maxLat!: number;

  /**
   * Longitude máxima (canto nordeste)
   *
   * @type {number}
   * @range -180 to 180
   * @description Longitude do canto nordeste da bounding box
   * @example -9.1
   */
  @ApiProperty()
  @IsNumber()
  @IsLongitude()
  @Type(() => Number)
  maxLng!: number;

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
