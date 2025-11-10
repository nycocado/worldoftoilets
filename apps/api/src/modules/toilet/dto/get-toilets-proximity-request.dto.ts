import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
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

export class GetToiletsProximityRequestDto {
  @ApiProperty({ required: true })
  @IsNumber()
  @IsLatitude()
  @Type(() => Number)
  lat!: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsLongitude()
  @Type(() => Number)
  lng!: number;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  pageable?: boolean = true;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 0;

  @ApiProperty({ required: false, default: 20 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  size?: number = 20;

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
