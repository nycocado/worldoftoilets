import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para a operação de atualização da avaliação de um comentário.
 */
export class UpdateCommentRateRequestDto {
  @ApiProperty({
    description: 'A avaliação do nível de limpeza do sanitário (1 a 5).',
    example: 5,
    minimum: 1,
    maximum: 5,
    required: false,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  @Type(() => Number)
  clean?: number;

  @ApiProperty({
    description: 'Indica se há papel higiênico disponível.',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  paper?: boolean;

  @ApiProperty({
    description: 'A avaliação do estado de conservação da estrutura (1 a 5).',
    example: 4,
    minimum: 1,
    maximum: 5,
    required: false,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  @Type(() => Number)
  structure?: number;

  @ApiProperty({
    description:
      'A avaliação do nível de acessibilidade para pessoas com mobilidade reduzida (1 a 5).',
    example: 5,
    minimum: 1,
    maximum: 5,
    required: false,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  @Type(() => Number)
  accessibility?: number;
}
