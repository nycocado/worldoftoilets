import { IsBoolean, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
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

  /**
   * Ativa a paginação.
   */
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @ApiPropertyOptional({
    description: 'Ativa a paginação',
    example: true,
  })
  pageable?: boolean;

  /**
   * Número da página.
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'Número da página',
    example: 0,
  })
  page?: number;

  /**
   * Tamanho da página.
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'Tamanho da página',
    example: 10,
  })
  size?: number;
}
