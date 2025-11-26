import { ApiProperty } from '@nestjs/swagger';
import { ApplyPartnerRequestDto } from './apply-partner-request.dto';

/**
 * DTO para a documentação do Swagger da candidatura de parceria com certificado.
 */
export class ApplyPartnerSwaggerDto extends ApplyPartnerRequestDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Documento de certificação (PDF, JPEG, PNG ou WebP, máx 10MB)',
  })
  certificate: unknown;
}
