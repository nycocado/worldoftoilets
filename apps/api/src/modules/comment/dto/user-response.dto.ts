import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de Response para Utilizador (em Comentário)
 *
 * @class UserResponseDto
 * @description Transfer Object para resposta com dados públicos do utilizador autor do comentário
 *
 * @property {string} publicId - ID público UUID do utilizador
 * @property {string} name - Nome de utilizador (display name)
 * @property {number} points - Total de pontos acumulados pelo utilizador
 * @property {string} icon - Ícone/avatar do utilizador
 * @property {boolean} isPartner - Indica se o utilizador é parceiro
 * @property {number} commentsCount - Total de comentários feitos pelo utilizador
 *
 * @example
 * {
 *   "publicId": "550e8400-e29b-41d4-a716-446655440000",
 *   "name": "João Silva",
 *   "points": 150,
 *   "icon": "icon-1",
 *   "isPartner": false,
 *   "commentsCount": 42
 * }
 */
export class UserResponseDto {
  /**
   * ID público do utilizador em formato UUID
   *
   * @type {string}
   * @format uuid
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  @ApiProperty()
  @Expose()
  publicId!: string;

  /**
   * Nome de utilizador (display name/alcunha)
   *
   * @type {string}
   * @example "João Silva"
   */
  @ApiProperty()
  @Expose()
  name!: string;

  /**
   * Total de pontos acumulados
   *
   * @type {number}
   * @description Pontos obtidos através de contribuições e atividades
   * @example 150
   */
  @ApiProperty()
  @Expose()
  points!: number;

  /**
   * Ícone/avatar do utilizador
   *
   * @type {string}
   * @description Identificador do avatar escolhido pelo utilizador
   * @example "icon-1"
   */
  @ApiProperty()
  @Expose()
  icon!: string;

  /**
   * Indica se o utilizador é parceiro
   *
   * @type {boolean}
   * @description Parceiros têm privilégios especiais na plataforma
   * @example false
   */
  @ApiProperty()
  @Expose()
  isPartner!: boolean;

  /**
   * Número de comentários feitos pelo utilizador
   *
   * @type {number}
   * @description Total de comentários associados ao utilizador
   * @example 42
   */
  @ApiProperty()
  @Expose()
  commentsCount!: number;
}
