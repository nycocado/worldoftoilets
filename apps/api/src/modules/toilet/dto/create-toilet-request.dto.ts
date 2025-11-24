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
 * DTO para a requisição de criação de uma nova casa de banho.
 */
export class CreateToiletRequestDto {
  @ApiProperty({
    description: 'O tipo de acesso da casa de banho.',
    enum: AccessApiName,
    example: AccessApiName.PUBLIC,
  })
  @IsEnum(AccessApiName)
  @IsNotEmpty()
  access!: AccessApiName;

  @ApiProperty({
    description: 'O nome da casa de banho.',
    example: 'Casa de Banho Central',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @IsNotEmpty()
  @Type(() => String)
  name!: string;

  @ApiProperty({
    description: 'A latitude da localização.',
    example: 38.7223,
  })
  @IsLatitude()
  @IsNotEmpty()
  @Type(() => Number)
  latitude!: number;

  @ApiProperty({
    description: 'A longitude da localização.',
    example: -9.1393,
  })
  @IsLongitude()
  @IsNotEmpty()
  @Type(() => Number)
  longitude!: number;

  @ApiProperty({
    description: 'A morada completa.',
    example: 'Praça do Comércio, 1',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsNotEmpty()
  @Type(() => String)
  address!: string;

  @ApiProperty({
    description: 'A cidade.',
    example: 'Lisboa',
  })
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  @Type(() => String)
  city!: string;

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
    example: 'Portugal',
  })
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  @IsValidCountry()
  @Type(() => String)
  country!: string;

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
