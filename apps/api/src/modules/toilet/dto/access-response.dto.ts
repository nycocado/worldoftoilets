import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para a resposta com os dados de um tipo de acesso.
 */
export class AccessResponseDto {
  @ApiProperty({
    description: 'O nome legível do tipo de acesso.',
    example: 'Público',
  })
  @Expose()
  name!: string;

  @ApiProperty({
    description: 'O identificador único do tipo de acesso.',
    example: 'public',
  })
  @Expose()
  apiName!: string;
}
