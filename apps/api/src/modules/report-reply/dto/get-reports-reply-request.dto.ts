import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { ReportReplyStatus } from 'src/database/entities/report-reply.entity';

/**
 * DTO de requisição para listar denúncias de respostas.
 */
export class GetReportsReplyRequestDto {
  @ApiPropertyOptional({
    description: 'Número da página.',
    minimum: 1,
    default: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Quantidade de itens por página.',
    minimum: 1,
    maximum: 100,
    default: 10,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Filtrar por status da denúncia.',
    enum: ReportReplyStatus,
    example: ReportReplyStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(ReportReplyStatus)
  status?: ReportReplyStatus;
}
