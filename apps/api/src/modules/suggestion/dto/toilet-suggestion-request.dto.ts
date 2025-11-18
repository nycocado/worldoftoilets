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

export class ToiletSuggestionRequestDto {
  @ApiProperty({ enum: AccessApiName })
  @IsEnum(AccessApiName)
  @IsNotEmpty()
  access!: AccessApiName;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @IsNotEmpty()
  @Type(() => String)
  name!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsNotEmpty()
  @Type(() => String)
  address!: string;

  @ApiProperty()
  @IsLatitude()
  @IsNotEmpty()
  @Type(() => Number)
  latitude!: number;

  @ApiProperty()
  @IsLongitude()
  @IsNotEmpty()
  @Type(() => Number)
  longitude!: number;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  @Type(() => String)
  city!: string;

  @ApiProperty({ required: false })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  @Type(() => String)
  state?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  @IsValidCountry()
  @Type(() => String)
  country!: string;

  @ApiProperty({ required: false })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  @Type(() => String)
  placeId?: string;

  @ApiProperty({
    required: false,
    enum: TypeExtraApiName,
    isArray: true,
  })
  @IsArray()
  @IsEnum(TypeExtraApiName, { each: true })
  @IsOptional()
  extras: TypeExtraApiName[];
}
