import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de Request para Criar Resposta
 *
 * @class CreateReplyRequestDto
 * @description Transfer Object para requisição de criação de nova resposta
 *
 * @property {string} commentPublicId - ID público UUID do comentário a responder
 * @property {string} text - Texto da resposta (1-280 caracteres)
 *
 * @example
 * {
 *   "commentPublicId": "550e8400-e29b-41d4-a716-446655440000",
 *   "text": "Concordo completamente!"
 * }
 */
export class CreateReplyRequestDto {
  /**
   * ID público do comentário a responder
   *
   * @type {string}
   * @format uuid
   * @description Identificador do comentário que está a ser respondido
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  @Type(() => String)
  commentPublicId!: string;

  /**
   * Texto da resposta
   *
   * @type {string}
   * @length 1-280
   * @description Texto da resposta ao comentário
   * @example "Concordo completamente!"
   */
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(280)
  @IsNotEmpty()
  @Type(() => String)
  text!: string;
}
