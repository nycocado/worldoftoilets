import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de Request para Atualizar Avaliação de Comentário
 *
 * @class UpdateCommentRateRequestDto
 * @description Transfer Object para requisição de atualização parcial de avaliações de toilet
 *
 * @property {number} clean - Avaliação de limpeza (1-5) (opcional)
 * @property {boolean} paper - Disponibilidade de papel higiénico (opcional)
 * @property {number} structure - Avaliação de estrutura/conservação (1-5) (opcional)
 * @property {number} accessibility - Avaliação de acessibilidade (1-5) (opcional)
 *
 * @example
 * {
 *   "clean": 5,
 *   "structure": 5
 * }
 */
export class UpdateCommentRateRequestDto {
  /**
   * Avaliação de limpeza do toilet
   *
   * @type {number}
   * @range 1-5
   * @description Nível de limpeza das instalações sanitárias
   * @example 5
   */
  @ApiProperty({ required: false })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  @Type(() => Number)
  clean?: number;

  /**
   * Disponibilidade de papel higiénico
   *
   * @type {boolean}
   * @description Indica se o toilet tem papel higiénico disponível
   * @example true
   */
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  paper?: boolean;

  /**
   * Avaliação de estrutura/conservação
   *
   * @type {number}
   * @range 1-5
   * @description Estado de conservação da estrutura e equipamentos
   * @example 4
   */
  @ApiProperty({ required: false })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  @Type(() => Number)
  structure?: number;

  /**
   * Avaliação de acessibilidade
   *
   * @type {number}
   * @range 1-5
   * @description Nível de acessibilidade para pessoas com mobilidade reduzida
   * @example 5
   */
  @ApiProperty({ required: false })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  @Type(() => Number)
  accessibility?: number;
}
