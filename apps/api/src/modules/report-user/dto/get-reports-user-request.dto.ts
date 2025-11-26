import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { ReportUserStatus } from 'src/database/entities/report-user.entity';

/**
 * DTO de requisição para listar denúncias de utilizadores.
 */
export class GetReportsUserRequestDto {
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
    enum: ReportUserStatus,
    example: ReportUserStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(ReportUserStatus)
  status?: ReportUserStatus;
}
