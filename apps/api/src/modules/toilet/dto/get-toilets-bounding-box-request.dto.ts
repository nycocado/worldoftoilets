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

export class GetToiletsBoundingBoxRequestDto {
  @ApiProperty()
  @IsNumber()
  @IsLatitude()
  @Type(() => Number)
  minLat!: number;

  @ApiProperty()
  @IsNumber()
  @IsLongitude()
  @Type(() => Number)
  minLng!: number;

  @ApiProperty()
  @IsNumber()
  @IsLatitude()
  @Type(() => Number)
  maxLat!: number;

  @ApiProperty()
  @IsNumber()
  @IsLongitude()
  @Type(() => Number)
  maxLng!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(AccessApiName)
  access?: AccessApiName;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(TypeExtraApiName, { each: true })
  @Transform(({ value }) => value.trim().split(','))
  extras?: TypeExtraApiName[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  timestamp?: Date = new Date();
}
