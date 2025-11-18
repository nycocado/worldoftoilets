import {
  IsArray,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
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
 * DTO de Request para Criar Toilet
 *
 * @class CreateToiletRequestDto
 * @description Transfer Object para requisição de criação de novo toilet
 *
 * @property {AccessApiName} access - Tipo de acesso do toilet (PUBLIC, PRIVATE, CUSTOMERS_ONLY)
 * @property {string} name - Nome do toilet (1-50 caracteres)
 * @property {number} latitude - Latitude da localização (-90 a 90)
 * @property {number} longitude - Longitude da localização (-180 a 180)
 * @property {string} address - Endereço completo (1-255 caracteres)
 * @property {string} city - Cidade (máx 100 caracteres)
 * @property {string} [state] - Estado/província opcional (máx 100 caracteres)
 * @property {string} country - País (máx 100 caracteres)
 * @property {string} [placeId] - ID do Google Places opcional (máx 255 caracteres)
 * @property {TypeExtraApiName[]} [extras] - Lista opcional de extras disponíveis
 *
 * @example
 * {
 *   "access": "PUBLIC",
 *   "name": "Casa de Banho Central",
 *   "latitude": 38.7223,
 *   "longitude": -9.1393,
 *   "address": "Praça do Comércio, 1",
 *   "city": "Lisboa",
 *   "state": "Lisboa",
 *   "country": "Portugal",
 *   "placeId": "ChIJa2s3k...",
 *   "extras": ["WIFI", "ACCESSIBLE", "BABY_CHANGING"]
 * }
 */
export class CreateToiletRequestDto {
  /**
   * Tipo de acesso do toilet
   *
   * @type {AccessApiName}
   * @enum {string}
   * @description Define quem pode acessar o toilet (PUBLIC, PRIVATE, CUSTOMERS_ONLY)
   * @example "PUBLIC"
   */
  @ApiProperty({ enum: AccessApiName })
  @IsEnum(AccessApiName)
  @IsNotEmpty()
  access!: AccessApiName;

  /**
   * Nome do toilet
   *
   * @type {string}
   * @length 1-50
   * @description Nome identificador do toilet
   * @example "Casa de Banho Central"
   */
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @IsNotEmpty()
  @Type(() => String)
  name!: string;

  /**
   * Latitude da localização
   *
   * @type {number}
   * @range -90 to 90
   * @description Coordenada de latitude em graus decimais
   * @example 38.7223
   */
  @ApiProperty()
  @IsLatitude()
  @IsNotEmpty()
  @Type(() => Number)
  latitude!: number;

  /**
   * Longitude da localização
   *
   * @type {number}
   * @range -180 to 180
   * @description Coordenada de longitude em graus decimais
   * @example -9.1393
   */
  @ApiProperty()
  @IsLongitude()
  @IsNotEmpty()
  @Type(() => Number)
  longitude!: number;

  /**
   * Endereço completo
   *
   * @type {string}
   * @length 1-255
   * @description Endereço postal completo do toilet
   * @example "Praça do Comércio, 1"
   */
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsNotEmpty()
  @Type(() => String)
  address!: string;

  /**
   * Cidade
   *
   * @type {string}
   * @maxLength 100
   * @description Cidade onde o toilet está localizado
   * @example "Lisboa"
   */
  @ApiProperty()
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  @Type(() => String)
  city!: string;

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
   * País
   *
   * @type {string}
   * @maxLength 100
   * @description Nome do país onde o toilet está localizado
   * @example "Portugal"
   */
  @ApiProperty()
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  @IsValidCountry()
  @Type(() => String)
  country!: string;

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
  @ApiProperty({
    required: false,
    enum: TypeExtraApiName,
    isArray: true,
  })
  @IsArray()
  @IsEnum(TypeExtraApiName, { each: true })
  @IsOptional()
  extras?: TypeExtraApiName[];
}
