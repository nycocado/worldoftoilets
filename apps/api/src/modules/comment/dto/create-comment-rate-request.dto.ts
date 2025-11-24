import { IsBoolean, IsInt, IsNotEmpty, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para a operação de criação da avaliação de um comentário.
 */
export class CreateCommentRateRequestDto {
  @ApiProperty({
    description: 'A avaliação do nível de limpeza do sanitário (1 a 5).',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  @Type(() => Number)
  clean!: number;

  @ApiProperty({
    description: 'Indica se há papel higiênico disponível.',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Type(() => Boolean)
  paper!: boolean;

  @ApiProperty({
    description: 'A avaliação do estado de conservação da estrutura (1 a 5).',
    example: 4,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  @Type(() => Number)
  structure!: number;

  @ApiProperty({
    description:
      'A avaliação do nível de acessibilidade para pessoas com mobilidade reduzida (1 a 5).',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  @Type(() => Number)
  accessibility!: number;
}
