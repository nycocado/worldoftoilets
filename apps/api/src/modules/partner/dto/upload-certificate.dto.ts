import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para documentação do upload de certificado no Swagger.
 */
export class UploadCertificateDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description:
      'Certificado da aplicação de parceria (PDF, JPEG, PNG ou WebP, máx 10MB)',
  })
  certificate: unknown;
}
