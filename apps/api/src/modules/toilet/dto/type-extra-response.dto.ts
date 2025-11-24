import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para a resposta com os dados de um tipo de recurso extra.
 */
export class TypeExtraResponseDto {
  @ApiProperty({
    description: 'O nome legível do recurso extra.',
    example: 'Acessível para cadeira de rodas',
  })
  @Expose()
  name!: string;

  @ApiProperty({
    description: 'O identificador único do tipo de recurso extra.',
    example: 'wheelchair-accessible',
  })
  @Expose()
  apiName!: string;
}
