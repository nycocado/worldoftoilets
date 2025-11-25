import { ApiProperty } from '@nestjs/swagger';
import { CreateToiletRequestDto } from './create-toilet-request.dto';

/**
 * DTO para a documentação do Swagger da criação de uma casa de banho com imagem.
 */
export class CreateToiletSwaggerDto extends CreateToiletRequestDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description:
      'Imagem da casa de banho (opcional, JPEG, PNG ou WebP, máx 5MB)',
    required: false,
  })
  image?: unknown;
}
