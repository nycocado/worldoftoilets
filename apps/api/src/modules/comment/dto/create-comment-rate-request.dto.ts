import { IsBoolean, IsInt, IsNotEmpty, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentRateRequestDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  @Type(() => Number)
  clean!: number;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  @Type(() => Boolean)
  paper!: boolean;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  @Type(() => Number)
  structure!: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  @Type(() => Number)
  accessibility!: number;
}
