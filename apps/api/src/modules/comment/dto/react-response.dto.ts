import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de Response para Reações de Comentário
 *
 * @class ReactResponseDto
 * @description Transfer Object para resposta com contadores de reações (likes/dislikes)
 *
 * @property {number} likes - Total de reações positivas (likes)
 * @property {number} dislikes - Total de reações negativas (dislikes)
 *
 * @example
 * {
 *   "likes": 10,
 *   "dislikes": 1
 * }
 */
export class ReactResponseDto {
  /**
   * Total de reações positivas (likes)
   *
   * @type {number}
   * @description Número de utilizadores que reagiram positivamente ao comentário
   * @default 0
   * @example 10
   */
  @ApiProperty()
  likes: number;

  /**
   * Total de reações negativas (dislikes)
   *
   * @type {number}
   * @description Número de utilizadores que reagiram negativamente ao comentário
   * @default 0
   * @example 1
   */
  @ApiProperty()
  dislikes: number;
}
