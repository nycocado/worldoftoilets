import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Tipo de Reação
 *
 * @enum ReactType
 * @description Tipos possíveis de reação a um comentário
 *
 * @property {string} LIKE - Reação positiva (like)
 * @property {string} DISLIKE - Reação negativa (dislike)
 */
export enum ReactType {
  LIKE = 'like',
  DISLIKE = 'dislike',
}

/**
 * DTO de Request para Reagir a Comentário
 *
 * @class PutReactRequestDto
 * @description Transfer Object para requisição de reação (like/dislike) a um comentário
 *
 * @property {ReactType} react - Tipo de reação (like ou dislike)
 *
 * @example
 * {
 *   "react": "like"
 * }
 */
export class PutReactRequestDto {
  /**
   * Tipo de reação ao comentário
   *
   * @type {ReactType}
   * @description Reação positiva (like) ou negativa (dislike)
   * @example "like"
   */
  @ApiProperty()
  @IsEnum(ReactType)
  @IsNotEmpty()
  react!: ReactType;
}
