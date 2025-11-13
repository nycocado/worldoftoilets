import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchToiletsRequestDto {
  @ApiProperty({ required: true })
  @IsString()
  query!: string;

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
}
