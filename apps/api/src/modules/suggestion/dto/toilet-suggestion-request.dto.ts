import { ApiProperty } from '@nestjs/swagger';
import { AccessApiName, TypeExtraApiName } from '@database/entities';
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
import { IsValidCountry } from '@common/decorators';

/**
 * DTO para os detalhes de uma casa de banho sugerida.
 */
export class ToiletSuggestionRequestDto {
  @ApiProperty({
    description: 'O tipo de acesso da casa de banho.',
    enum: AccessApiName,
  })
  @IsEnum(AccessApiName)
  @IsNotEmpty()
  access!: AccessApiName;

  @ApiProperty({ description: 'O nome da casa de banho.' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @IsNotEmpty()
  @Type(() => String)
  name!: string;

  @ApiProperty({ description: 'A morada da casa de banho.' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsNotEmpty()
  @Type(() => String)
  address!: string;

  @ApiProperty({ description: 'A latitude da casa de banho.' })
  @IsLatitude()
  @IsNotEmpty()
  @Type(() => Number)
  latitude!: number;

  @ApiProperty({ description: 'A longitude da casa de banho.' })
  @IsLongitude()
  @IsNotEmpty()
  @Type(() => Number)
  longitude!: number;

  @ApiProperty({ description: 'A cidade da casa de banho.' })
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  @Type(() => String)
  city!: string;

  @ApiProperty({
    description: 'O estado/distrito da casa de banho.',
    required: false,
  })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  @Type(() => String)
  state?: string;

  @ApiProperty({ description: 'O país da casa de banho.' })
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  @IsValidCountry()
  @Type(() => String)
  country!: string;

  @ApiProperty({
    description: 'O ID do Google Places da casa de banho.',
    required: false,
  })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  @Type(() => String)
  placeId?: string;

  @ApiProperty({
    description: 'A lista de extras da casa de banho.',
    required: false,
    enum: TypeExtraApiName,
    isArray: true,
  })
  @IsArray()
  @IsEnum(TypeExtraApiName, { each: true })
  @IsOptional()
  extras: TypeExtraApiName[];
}
