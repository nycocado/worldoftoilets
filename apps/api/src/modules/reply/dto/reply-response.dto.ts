import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserCommentResponseDto } from '@modules/user/dto/user-comment-response.dto';

/**
 * DTO de Response para Resposta
 *
 * @class ReplyResponseDto
 * @description Transfer Object para resposta com dados públicos de uma resposta
 *
 * @property {string} publicId - ID público UUID da resposta
 * @property {string} text - Texto da resposta (máx 280 caracteres)
 * @property {UserCommentResponseDto} user - Dados do utilizador que criou a resposta
 * @property {Date} createdAt - Data de criação da resposta
 *
 * @example
 * {
 *   "publicId": "550e8400-e29b-41d4-a716-446655440000",
 *   "text": "Concordo completamente!",
 *   "user": { "publicId": "...", "name": "João Silva", ... },
 *   "createdAt": "2025-11-14T10:30:00Z"
 * }
 */
export class ReplyResponseDto {
  /**
   * ID público da resposta em formato UUID
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
   * Texto da resposta
   *
   * @type {string}
   * @length 1-280
   * @description Texto da resposta ao comentário
   * @example "Concordo completamente!"
   */
  @ApiProperty()
  @Expose()
  @Type(() => String)
  text!: string;

  /**
   * Dados do utilizador autor da resposta
   *
   * @type {UserCommentResponseDto}
   * @description Informações públicas do utilizador que criou a resposta
   */
  @ApiProperty({ type: () => UserCommentResponseDto })
  @Expose()
  @Type(() => UserCommentResponseDto)
  user!: UserCommentResponseDto;

  /**
   * Data de criação da resposta
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
