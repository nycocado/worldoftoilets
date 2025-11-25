import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { PartnerStatus } from '@database/entities';

/**
 * DTO para listar candidaturas de parceria com filtros e paginação.
 */
export class GetPartnersManageRequestDto {
  @IsOptional()
  @IsEnum(PartnerStatus)
  @ApiProperty({
    description: 'Filtrar por status da parceria.',
    enum: PartnerStatus,
    required: false,
    example: PartnerStatus.PENDING,
  })
  status?: PartnerStatus;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description:
      'Pesquisar por nome do candidato, e-mail ou nome da casa de banho.',
    required: false,
    example: 'Shopping',
  })
  search?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @ApiProperty({
    description: 'Ativar ou desativar a paginação.',
    required: false,
    default: true,
    example: true,
  })
  pageable?: boolean = true;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @ApiProperty({
    description: 'Número da página (inicia em 1).',
    required: false,
    default: 1,
    example: 1,
  })
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  @ApiProperty({
    description: 'Número de itens por página.',
    required: false,
    default: 10,
    example: 10,
  })
  size?: number = 10;

  @IsOptional()
  @Type(() => Date)
  @ApiProperty({
    description:
      'Timestamp para paginação cursor-based (retorna registos criados após esta data).',
    required: false,
    example: '2024-01-15T10:30:00.000Z',
  })
  timestamp?: Date;
}
