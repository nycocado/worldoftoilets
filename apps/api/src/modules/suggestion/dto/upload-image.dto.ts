import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para documentação do upload de imagem de sugestão no Swagger.
 */
export class UploadSuggestionImageDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Imagem da sugestão (JPEG, PNG ou WebP, máx 5MB)',
  })
  image: unknown;
}
