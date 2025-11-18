import { Expose, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CommentRateCommentResponseDto } from '@modules/comment-rate/dto/comment-rate-comment-response.dto';
import { ReactCommentResponseDto } from '@modules/react/dto/react-comment-response.dto';
import { UserCommentResponseDto } from '@modules/user/dto/user-comment-response.dto';

/**
 * DTO de Response para Comentário
 *
 * @class CommentResponseDto
 * @description Transfer Object para resposta com dados públicos de um comentário
 *
 * @property {string} publicId - ID público UUID do comentário
 * @property {string} text - Texto do comentário (opcional, máx 280 caracteres)
 * @property {number} score - Score calculado do comentário baseado nas avaliações
 * @property {CommentRateCommentResponseDto} rate - Avaliações atribuídas ao toilet
 * @property {ReactCommentResponseDto} reacts - Contadores de reações (likes/dislikes)
 * @property {UserCommentResponseDto} user - Dados do utilizador que criou o comentário
 * @property {Date} createdAt - Data de criação do comentário
 *
 * @example
 * {
 *   "publicId": "550e8400-e29b-41d4-a716-446655440000",
 *   "text": "Instalações muito limpas e bem mantidas!",
 *   "score": 4.5,
 *   "rate": { "clean": 5, "paper": true, "structure": 4, "accessibility": 5 },
 *   "reacts": { "likes": 10, "dislikes": 1 },
 *   "user": { "publicId": "...", "name": "João Silva", ... },
 *   "createdAt": "2025-11-14T10:30:00Z"
 * }
 */
export class CommentResponseDto {
  /**
   * ID público do comentário em formato UUID
   *
   * @type {string}
   * @format uuid
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  @ApiProperty()
  @Expose()
  @Type(() => String)
  publicId!: string;

  /**
   * Texto opcional do comentário
   *
   * @type {string}
   * @length 1-280
   * @description Comentário textual opcional do utilizador sobre o toilet
   * @example "Instalações muito limpas e bem mantidas!"
   */
  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? null)
  @Type(() => String)
  text?: string;

  /**
   * Score calculado do comentário
   *
   * @type {number}
   * @description Score médio calculado baseado nas avaliações (clean, structure, accessibility)
   * @range 1-5
   * @example 4.5
   */
  @ApiProperty()
  @Expose()
  @Type(() => Number)
  score!: number;

  /**
   * Avaliações atribuídas ao toilet
   *
   * @type {CommentRateCommentResponseDto}
   * @description Avaliações de limpeza, papel, estrutura e acessibilidade
   */
  @ApiProperty()
  @Expose()
  @Type(() => CommentRateCommentResponseDto)
  rate?: CommentRateCommentResponseDto;

  /**
   * Contadores de reações ao comentário
   *
   * @type {ReactCommentResponseDto}
   * @description Total de likes e dislikes recebidos
   */
  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => ({
    likes: obj.likes ?? 0,
    dislikes: obj.dislikes ?? 0,
  }))
  @Type(() => ReactCommentResponseDto)
  reactCounts!: ReactCommentResponseDto;

  /**
   * Dados do utilizador autor do comentário
   *
   * @type {UserCommentResponseDto}
   * @description Informações públicas do utilizador que criou o comentário
   */
  @ApiProperty({ type: () => UserCommentResponseDto })
  @Expose()
  @Type(() => UserCommentResponseDto)
  user!: UserCommentResponseDto;

  /**
   * Data de criação do comentário
   *
   * @type {Date}
   * @format date-time
   * @example "2025-11-14T10:30:00Z"
   */
  @ApiProperty()
  @Expose()
  @Type(() => Date)
  createdAt!: Date;
}
