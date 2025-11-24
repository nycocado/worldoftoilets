import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para a resposta da avaliação de um comentário.
 */
export class CommentRateCommentResponseDto {
  @ApiProperty({
    description: 'A avaliação do nível de limpeza do sanitário (1 a 5).',
    example: 5,
  })
  @Expose()
  @Type(() => Number)
  clean!: number;

  @ApiProperty({
    description: 'Indica se há papel higiênico disponível.',
    example: true,
  })
  @Expose()
  @Type(() => Boolean)
  paper!: boolean;

  @ApiProperty({
    description: 'A avaliação do estado de conservação da estrutura (1 a 5).',
    example: 4,
  })
  @Expose()
  @Type(() => Number)
  structure!: number;

  @ApiProperty({
    description:
      'A avaliação do nível de acessibilidade para pessoas com mobilidade reduzida (1 a 5).',
    example: 5,
  })
  @Expose()
  @Type(() => Number)
  accessibility!: number;
}
