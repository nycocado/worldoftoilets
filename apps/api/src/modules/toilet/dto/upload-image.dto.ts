import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para a documentação do Swagger do upload de uma imagem.
 */
export class UploadImageDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Arquivo de imagem (JPEG, PNG ou WebP, máx 5MB)',
  })
  image: unknown;
}
