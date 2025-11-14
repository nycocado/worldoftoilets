import { Expose, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CommentRateResponseDto } from '@modules/comment/dto/comment-rate-response.dto';
import { UserResponseDto } from '@modules/comment/dto';
import { ReactResponseDto } from '@modules/comment/dto/react-response.dto';

/**
 * DTO de Response para Comentário
 *
 * @class CommentResponseDto
 * @description Transfer Object para resposta com dados públicos de um comentário
 *
 * @property {string} publicId - ID público UUID do comentário
 * @property {string} text - Texto do comentário (opcional, máx 280 caracteres)
 * @property {number} score - Score calculado do comentário baseado nas avaliações
 * @property {CommentRateResponseDto} rate - Avaliações atribuídas ao toilet
 * @property {ReactResponseDto} reacts - Contadores de reações (likes/dislikes)
 * @property {UserResponseDto} user - Dados do utilizador que criou o comentário
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
  publicId!: string;

  /**
   * Texto opcional do comentário
   *
   * @type {string}
   * @length 1-280
   * @description Comentário textual opcional do utilizador sobre o toilet
   * @example "Instalações muito limpas e bem mantidas!"
   */
  @ApiProperty({ required: false })
  @Expose()
  @Transform(({ value }) => value ?? null)
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
  score!: number;

  /**
   * Avaliações atribuídas ao toilet
   *
   * @type {CommentRateResponseDto}
   * @description Avaliações de limpeza, papel, estrutura e acessibilidade
   */
  @ApiProperty({ required: false })
  @Expose()
  @Type(() => CommentRateResponseDto)
  rate?: CommentRateResponseDto;

  /**
   * Contadores de reações ao comentário
   *
   * @type {ReactResponseDto}
   * @description Total de likes e dislikes recebidos
   */
  @ApiProperty()
  @Expose()
  @Type(() => ReactResponseDto)
  reacts!: ReactResponseDto;

  /**
   * Dados do utilizador autor do comentário
   *
   * @type {UserResponseDto}
   * @description Informações públicas do utilizador que criou o comentário
   */
  @ApiProperty()
  @Expose()
  @Type(() => UserResponseDto)
  user!: UserResponseDto;

  /**
   * Data de criação do comentário
   *
   * @type {Date}
   * @format date-time
   * @example "2025-11-14T10:30:00Z"
   */
  @ApiProperty()
  @Expose()
  createdAt!: Date;
}
