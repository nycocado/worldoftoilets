import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import {
  AccessApiName,
  ToiletStatus,
  TypeExtraApiName,
} from '@database/entities';

/**
 * DTO para a requisição de listagem de casas de banho para gestão.
 */
export class GetToiletsManageRequestDto {
  @ApiProperty({
    description: 'Define se a paginação deve ser aplicada.',
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  pageable?: boolean = true;

  @ApiProperty({
    description: 'O número da página a ser retornada.',
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 0;

  @ApiProperty({
    description: 'O número de itens por página.',
    required: false,
    default: 20,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  size?: number = 20;

  @ApiProperty({
    description: 'Filtra por cidade.',
    required: false,
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    description: 'Filtra por país.',
    required: false,
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    description: 'Filtra por código do país.',
    required: false,
  })
  @IsOptional()
  @IsString()
  countryCode?: string;

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
    description: 'Filtra por status.',
    required: false,
    enum: ToiletStatus,
  })
  @IsOptional()
  @IsEnum(ToiletStatus)
  status?: ToiletStatus = ToiletStatus.ACTIVE;

  @ApiProperty({
    description: 'Filtra por data de criação/atualização.',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  timestamp?: Date = new Date();
}
