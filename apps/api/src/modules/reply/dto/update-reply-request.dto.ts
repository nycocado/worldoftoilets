import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de Request para Atualizar Resposta
 *
 * @class UpdateReplyRequestDto
 * @description Transfer Object para requisição de atualização de resposta existente
 *
 * @property {string} text - Novo texto da resposta (1-280 caracteres)
 *
 * @example
 * {
 *   "text": "Concordo completamente! Atualizado."
 * }
 */
export class UpdateReplyRequestDto {
  /**
   * Novo texto da resposta
   *
   * @type {string}
   * @length 1-280
   * @description Texto atualizado da resposta ao comentário
   * @example "Concordo completamente! Atualizado."
   */
  @ApiProperty({ required: false })
  @IsString()
  @MinLength(1)
  @MaxLength(280)
  @IsOptional()
  @Type(() => String)
  text?: string;
}
