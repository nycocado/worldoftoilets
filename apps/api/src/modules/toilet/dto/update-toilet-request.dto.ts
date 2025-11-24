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
 * DTO para a requisição de atualização de uma casa de banho.
 */
export class UpdateToiletRequestDto {
  @ApiProperty({
    description: 'O tipo de acesso da casa de banho.',
    required: false,
    enum: AccessApiName,
    example: AccessApiName.PUBLIC,
  })
  @IsEnum(AccessApiName)
  @IsOptional()
  access?: AccessApiName;

  @ApiProperty({
    description: 'O nome da casa de banho.',
    required: false,
    example: 'Casa de Banho Central',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @IsOptional()
  @Type(() => String)
  name?: string;

  @ApiProperty({
    description: 'A latitude da localização.',
    required: false,
    example: 38.7223,
  })
  @IsLatitude()
  @IsOptional()
  @Type(() => Number)
  latitude?: number;

  @ApiProperty({
    description: 'A longitude da localização.',
    required: false,
    example: -9.1393,
  })
  @IsLongitude()
  @IsOptional()
  @Type(() => Number)
  longitude?: number;

  @ApiProperty({
    description: 'A morada completa.',
    required: false,
    example: 'Praça do Comércio, 1',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  @Type(() => String)
  address?: string;

  @ApiProperty({
    description: 'A cidade.',
    required: false,
    example: 'Lisboa',
  })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  @Type(() => String)
  city?: string;

  @ApiProperty({
    description: 'O estado ou província.',
    required: false,
    example: 'Lisboa',
  })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  @Type(() => String)
  state?: string;

  @ApiProperty({
    description: 'O país.',
    required: false,
    example: 'Portugal',
  })
  @IsString()
  @MaxLength(100)
  @IsValidCountry()
  @IsOptional()
  @Type(() => String)
  country?: string;

  @ApiProperty({
    description: 'O ID do Google Places.',
    required: false,
    example: 'ChIJa2s3k...',
  })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  @Type(() => String)
  placeId?: string;

  @ApiProperty({
    description: 'A lista de recursos extra.',
    required: false,
    enum: TypeExtraApiName,
    isArray: true,
    example: [TypeExtraApiName.WHEELCHAIR_ACCESSIBLE],
  })
  @IsArray()
  @IsEnum(TypeExtraApiName, { each: true })
  @IsOptional()
  extras?: TypeExtraApiName[];
}
