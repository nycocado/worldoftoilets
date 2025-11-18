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

export class UpdateToiletRequestDto {
  @ApiProperty({ required: false })
  @IsEnum(AccessApiName)
  @IsOptional()
  access?: AccessApiName;

  @ApiProperty({ required: false })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @IsOptional()
  @Type(() => String)
  name?: string;

  @ApiProperty({ required: false })
  @IsLatitude()
  @IsOptional()
  @Type(() => Number)
  latitude?: number;

  @ApiProperty({ required: false })
  @IsLongitude()
  @IsOptional()
  @Type(() => Number)
  longitude?: number;

  @ApiProperty({ required: false })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  @Type(() => String)
  address?: string;

  @ApiProperty({ required: false })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  @Type(() => String)
  city?: string;

  @ApiProperty({ required: false })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  @Type(() => String)
  state?: string;

  @ApiProperty({ required: false })
  @IsString()
  @MaxLength(100)
  @IsValidCountry()
  @IsOptional()
  @Type(() => String)
  country?: string;

  @ApiProperty({ required: false })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  @Type(() => String)
  placeId?: string;

  @ApiProperty({ required: false })
  @IsArray()
  @IsEnum(TypeExtraApiName, { each: true })
  @IsOptional()
  extras?: TypeExtraApiName[];
}
