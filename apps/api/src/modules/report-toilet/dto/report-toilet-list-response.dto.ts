import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  ReportToiletStatus,
  TypeReportToiletApiName,
} from '@database/entities';
import { ToiletResponseDto } from '@modules/toilet/dto';

/**
 * DTO de resposta para listagem de casas de banho denunciadas.
 */
export class ReportToiletListResponseDto {
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
    description: 'Tipo de denúncia mais frequente.',
    enum: TypeReportToiletApiName,
  })
  @Expose()
  mostFrequentType: TypeReportToiletApiName;

  @ApiProperty({ description: 'Data da denúncia mais recente.' })
  @Expose()
  @Type(() => Date)
  latestReportDate: Date;

  @ApiProperty({
    description: 'Status agregado da denúncia.',
    enum: ReportToiletStatus,
  })
  @Expose()
  status: ReportToiletStatus;
}
