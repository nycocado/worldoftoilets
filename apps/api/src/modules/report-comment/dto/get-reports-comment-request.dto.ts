import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ReportCommentStatus } from '@database/entities';

/**
 * DTO de requisição para listar comentários denunciados.
 */
export class GetReportsCommentRequestDto {
  /**
   * Status da denúncia para filtro.
   */
  @IsOptional()
  @IsEnum(ReportCommentStatus)
  @ApiPropertyOptional({
    description: 'Status da denúncia para filtro',
    example: ReportCommentStatus.PENDING,
    enum: ReportCommentStatus,
  })
  status?: ReportCommentStatus;

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
