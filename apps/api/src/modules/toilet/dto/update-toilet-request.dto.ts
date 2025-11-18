import {
  IsArray,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AccessApiName, TypeExtraApiName } from '@database/entities';
import { IsValidCountry } from '@common/decorators';

/**
 * DTO de Request para Atualizar Toilet
 *
 * @class UpdateToiletRequestDto
 * @description Transfer Object para requisição de atualização de toilet.
 * Todos os campos são opcionais - apenas os fornecidos serão atualizados.
 *
 * @property {AccessApiName} [access] - Tipo de acesso do toilet
 * @property {string} [name] - Nome do toilet
 * @property {number} [latitude] - Latitude da localização
 * @property {number} [longitude] - Longitude da localização
 * @property {string} [address] - Endereço completo
 * @property {string} [city] - Cidade
 * @property {string} [state] - Estado/província
 * @property {string} [country] - País
 * @property {string} [placeId] - Google Places ID
 * @property {TypeExtraApiName[]} [extras] - Lista de extras
 */
export class UpdateToiletRequestDto {
  /**
   * Tipo de acesso do toilet (opcional)
   *
   * @type {AccessApiName}
   * @enum {string}
   * @description Define quem pode acessar o toilet (PUBLIC, PRIVATE, CUSTOMERS_ONLY)
   * @example "PUBLIC"
   */
  @ApiProperty({ required: false, enum: AccessApiName })
  @IsEnum(AccessApiName)
  @IsOptional()
  access?: AccessApiName;

  /**
   * Nome do toilet (opcional)
   *
   * @type {string}
   * @length 1-50
   * @description Nome identificador do toilet
   * @example "Casa de Banho Central"
   */
  @ApiProperty({ required: false })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @IsOptional()
  @Type(() => String)
  name?: string;

  /**
   * Latitude da localização (opcional)
   *
   * @type {number}
   * @range -90 to 90
   * @description Coordenada de latitude em graus decimais
   * @example 38.7223
   */
  @ApiProperty({ required: false })
  @IsLatitude()
  @IsOptional()
  @Type(() => Number)
  latitude?: number;

  /**
   * Longitude da localização (opcional)
   *
   * @type {number}
   * @range -180 to 180
   * @description Coordenada de longitude em graus decimais
   * @example -9.1393
   */
  @ApiProperty({ required: false })
  @IsLongitude()
  @IsOptional()
  @Type(() => Number)
  longitude?: number;

  /**
   * Endereço completo (opcional)
   *
   * @type {string}
   * @length 1-255
   * @description Endereço postal completo do toilet
   * @example "Praça do Comércio, 1"
   */
  @ApiProperty({ required: false })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  @Type(() => String)
  address?: string;

  /**
   * Cidade (opcional)
   *
   * @type {string}
   * @maxLength 100
   * @description Cidade onde o toilet está localizado
   * @example "Lisboa"
   */
  @ApiProperty({ required: false })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  @Type(() => String)
  city?: string;

  /**
   * Estado ou província (opcional)
   *
   * @type {string}
   * @maxLength 100
   * @description Estado/província/região onde o toilet está localizado
   * @example "Lisboa"
   */
  @ApiProperty({ required: false })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  @Type(() => String)
  state?: string;

  /**
   * País (opcional)
   *
   * @type {string}
   * @maxLength 100
   * @description Nome do país onde o toilet está localizado
   * @example "Portugal"
   */
  @ApiProperty({ required: false })
  @IsString()
  @MaxLength(100)
  @IsValidCountry()
  @IsOptional()
  @Type(() => String)
  country?: string;

  /**
   * Google Places ID (opcional)
   *
   * @type {string}
   * @maxLength 255
   * @description Identificador do Google Places para este local
   * @example "ChIJa2s3k..."
   */
  @ApiProperty({ required: false })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  @Type(() => String)
  placeId?: string;

  /**
   * Lista de extras disponíveis (opcional)
   *
   * @type {TypeExtraApiName[]}
   * @description Amenidades e recursos disponíveis no toilet
   * @example ["WIFI", "ACCESSIBLE", "BABY_CHANGING"]
   */
  @ApiProperty({ required: false, enum: TypeExtraApiName, isArray: true })
  @IsArray()
  @IsEnum(TypeExtraApiName, { each: true })
  @IsOptional()
  extras?: TypeExtraApiName[];
}
