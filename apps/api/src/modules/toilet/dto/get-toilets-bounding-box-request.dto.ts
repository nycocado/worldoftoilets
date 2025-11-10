import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  AccessApiName,
  CityApiName,
  CountryApiName,
  ToiletStatus,
} from '@database/entities';

export class GetToiletsBoundingBoxRequestDto {
  @ApiProperty({ required: true })
  @IsNumber()
  @IsLatitude()
  @Type(() => Number)
  minLat!: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsLongitude()
  @Type(() => Number)
  minLng!: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsLatitude()
  @Type(() => Number)
  maxLat!: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsLongitude()
  @Type(() => Number)
  maxLng!: number;

  @ApiProperty({ required: false, enum: CityApiName })
  @IsOptional()
  @IsEnum(CityApiName)
  city?: CityApiName;

  @ApiProperty({ required: false, enum: CountryApiName })
  @IsOptional()
  @IsEnum(CountryApiName)
  country?: CountryApiName;

  @ApiProperty({ required: false, enum: AccessApiName })
  @IsOptional()
  @IsEnum(AccessApiName)
  access?: AccessApiName;

  @ApiProperty({ required: false, enum: ToiletStatus })
  @IsOptional()
  @IsEnum(ToiletStatus)
  status?: ToiletStatus = ToiletStatus.ACTIVE;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  timestamp?: Date = new Date();
}
