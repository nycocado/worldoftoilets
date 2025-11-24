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

/**
 * DTO para a requisição de listagem de casas de banho por área geográfica.
 */
export class GetToiletsBoundingBoxRequestDto {
  @ApiProperty({
    description: 'A latitude mínima da área de busca.',
    example: 38.7,
  })
  @IsNumber()
  @IsLatitude()
  @Type(() => Number)
  minLat!: number;

  @ApiProperty({
    description: 'A longitude mínima da área de busca.',
    example: -9.2,
  })
  @IsNumber()
  @IsLongitude()
  @Type(() => Number)
  minLng!: number;

  @ApiProperty({
    description: 'A latitude máxima da área de busca.',
    example: 38.8,
  })
  @IsNumber()
  @IsLatitude()
  @Type(() => Number)
  maxLat!: number;

  @ApiProperty({
    description: 'A longitude máxima da área de busca.',
    example: -9.1,
  })
  @IsNumber()
  @IsLongitude()
  @Type(() => Number)
  maxLng!: number;

  @ApiProperty({
    description: 'Filtra por tipo de acesso.',
    required: false,
    enum: AccessApiName,
  })
  @IsOptional()
  @IsEnum(AccessApiName)
  access?: AccessApiName;

  @ApiProperty({
    description: 'Filtra por recursos extra (separados por vírgula).',
    required: false,
    enum: TypeExtraApiName,
    isArray: true,
  })
  @IsOptional()
  @IsEnum(TypeExtraApiName, { each: true })
  @Transform(({ value }) => value.trim().split(','))
  extras?: TypeExtraApiName[];

  @ApiProperty({
    description: 'Filtra por data de criação/atualização.',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  timestamp?: Date = new Date();
}
