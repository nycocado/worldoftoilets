import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

/**
 * DTO de resposta para tipo de denúncia de resposta.
 */
export class TypeReportReplyResponseDto {
  @ApiProperty({
    description: 'Nome do tipo de denúncia.',
    example: 'Conteúdo inadequado ou fora do tópico',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Identificador API do tipo de denúncia.',
    example: 'inappropriate-content',
  })
  @Expose()
  apiName: string;
}
