import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { ReportUserStatus } from 'src/database/entities/report-user.entity';

/**
 * DTO de requisição para listar denúncias de utilizadores.
 */
export class GetReportsUserRequestDto {
  @ApiProperty({
    description: 'Número da página.',
    minimum: 0,
    default: 1,
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page?: number = 0;

  @ApiProperty({
    description: 'Quantidade de itens por página.',
    minimum: 1,
    default: 10,
    example: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({
    description: 'Filtrar por status da denúncia.',
    enum: ReportUserStatus,
    example: ReportUserStatus.PENDING,
    required: false,
  })
  @IsOptional()
  @IsEnum(ReportUserStatus)
  status?: ReportUserStatus;
}
