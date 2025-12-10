import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ReportToiletStatus } from '@database/entities';

/**
 * DTO para a operação de listagem de denúncias de casas de banho.
 */
export class GetReportsToiletRequestDto {
  @ApiProperty({
    description: 'Filtrar por status da denúncia.',
    enum: ReportToiletStatus,
    required: false,
  })
  @IsEnum(ReportToiletStatus)
  @IsOptional()
  status?: ReportToiletStatus;

  @ApiProperty({
    description: 'Número da página.',
    default: 0,
    required: false,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  page?: number = 0;

  @ApiProperty({
    description: 'Tamanho da página.',
    default: 10,
    required: false,
  })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}
