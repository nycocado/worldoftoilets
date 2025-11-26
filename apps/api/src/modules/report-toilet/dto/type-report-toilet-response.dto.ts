import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TypeReportToiletApiName } from '@database/entities';

/**
 * DTO de resposta para tipo de denúncia de casa de banho.
 */
export class TypeReportToiletResponseDto {
  @ApiProperty({ description: 'Nome do tipo de denúncia.' })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Nome de API do tipo de denúncia.',
    enum: TypeReportToiletApiName,
  })
  @Expose()
  apiName: TypeReportToiletApiName;
}
