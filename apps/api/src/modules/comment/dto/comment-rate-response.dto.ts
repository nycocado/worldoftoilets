import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de Response para Avaliação de Comentário
 *
 * @class CommentRateResponseDto
 * @description Transfer Object para resposta com avaliações atribuídas a um toilet
 *
 * @property {number} clean - Avaliação de limpeza (1-5)
 * @property {boolean} paper - Disponibilidade de papel higiénico
 * @property {number} structure - Avaliação de estrutura/conservação (1-5)
 * @property {number} accessibility - Avaliação de acessibilidade (1-5)
 *
 * @example
 * {
 *   "clean": 5,
 *   "paper": true,
 *   "structure": 4,
 *   "accessibility": 5
 * }
 */
export class CommentRateResponseDto {
  /**
   * Avaliação de limpeza do toilet
   *
   * @type {number}
   * @range 1-5
   * @description Nível de limpeza das instalações sanitárias
   * @example 5
   */
  @ApiProperty()
  @Expose()
  clean!: number;

  /**
   * Disponibilidade de papel higiénico
   *
   * @type {boolean}
   * @description Indica se o toilet tem papel higiénico disponível
   * @example true
   */
  @ApiProperty()
  @Expose()
  paper!: boolean;

  /**
   * Avaliação de estrutura/conservação
   *
   * @type {number}
   * @range 1-5
   * @description Estado de conservação da estrutura e equipamentos
   * @example 4
   */
  @ApiProperty()
  @Expose()
  structure!: number;

  /**
   * Avaliação de acessibilidade
   *
   * @type {number}
   * @range 1-5
   * @description Nível de acessibilidade para pessoas com mobilidade reduzida
   * @example 5
   */
  @ApiProperty()
  @Expose()
  accessibility!: number;
}
