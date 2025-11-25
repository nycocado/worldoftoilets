import { ApiProperty } from '@nestjs/swagger';
import { CreateSuggestionRequestDto } from './create-suggestion-request.dto';

/**
 * DTO para a documentação do Swagger da criação de uma sugestão com imagem.
 */
export class CreateSuggestionSwaggerDto extends CreateSuggestionRequestDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Imagem da casa de banho (JPEG, PNG ou WebP, máx 5MB)',
  })
  image: unknown;
}
