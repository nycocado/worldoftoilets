import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para a resposta da média de avaliações de um sanitário.
 */
export class CommentRateToiletResponseDto {
  @ApiProperty({
    description: 'O número total de avaliações.',
    example: 10,
  })
  @Expose()
  totalRatings!: number;

  @ApiProperty({
    description: 'A média da avaliação de limpeza (1 a 5).',
    example: 4.5,
  })
  @Expose()
  avgClean!: number;

  @ApiProperty({
    description: 'A média da avaliação de estrutura (1 a 5).',
    example: 4.2,
  })
  @Expose()
  avgStructure!: number;

  @ApiProperty({
    description: 'A média da avaliação de acessibilidade (1 a 5).',
    example: 4.8,
  })
  @Expose()
  avgAccessibility!: number;

  @ApiProperty({
    description:
      'A percentagem de avaliações que indicam disponibilidade de papel (0 a 1).',
    example: 0.9,
  })
  @Expose()
  paperAvailability!: number;
}
