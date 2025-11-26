import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ToiletResponseDto } from '@modules/toilet/dto';
import { ReportToiletResponseDto } from '@modules/report-toilet';

/**
 * DTO de resposta para detalhes de denúncias de uma casa de banho.
 */
export class ReportToiletDetailResponseDto {
  @ApiProperty({
    description: 'Casa de banho denunciada.',
    type: () => ToiletResponseDto,
  })
  @Expose()
  @Type(() => ToiletResponseDto)
  toilet: ToiletResponseDto;

  @ApiProperty({ description: 'Total de denúncias.' })
  @Expose()
  totalReports: number;

  @ApiProperty({
    description: 'Lista de todas as denúncias.',
    type: () => [ReportToiletResponseDto],
  })
  @Expose()
  @Type(() => ReportToiletResponseDto)
  reports: ReportToiletResponseDto[];

  @ApiProperty({
    description: 'Contagem de denúncias por tipo.',
    example: { 'fake-information': 5, 'unsanitary-conditions': 3 },
  })
  @Expose()
  reportsByType: Record<string, number>;
}
