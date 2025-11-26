import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

/**
 * DTO de resposta para tipo de denúncia de utilizador.
 */
export class TypeReportUserResponseDto {
  @ApiProperty({
    description: 'Nome do tipo de denúncia.',
    example: 'Assédio ou abuso',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Identificador API do tipo de denúncia.',
    example: 'harassment-abuse',
  })
  @Expose()
  apiName: string;
}
