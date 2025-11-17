import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserBaseDto } from '@modules/user/dto/user-base.dto';

/**
 * DTO de Response para Utilizador (em Comentário)
 *
 * @class UserCommentResponseDto
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
export class UserCommentResponseDto extends UserBaseDto {
  /**
   * Total de pontos acumulados
   *
   * @type {number}
   * @description Pontos obtidos através de contribuições e atividades
   * @example 150
   */
  @ApiProperty()
  @Expose()
  @Type(() => Number)
  points!: number;

  /**
   * Indica se o utilizador é parceiro
   *
   * @type {boolean}
   * @description Parceiros têm privilégios especiais na plataforma
   * @example false
   */
  @ApiProperty()
  @Expose()
  @Type(() => Boolean)
  isPartner!: boolean;
}
