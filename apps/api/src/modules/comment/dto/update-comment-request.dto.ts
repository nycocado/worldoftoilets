import { UpdateCommentRateRequestDto } from '@modules/comment/dto/update-comment-rate-request.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCommentRateRequestDto } from '@modules/comment/dto/create-comment-rate-request.dto';

/**
 * DTO de Request para Atualizar Comentário
 *
 * @class UpdateCommentRequestDto
 * @description Transfer Object para requisição de atualização de comentário existente
 *
 * @property {string} text - Texto opcional do comentário (1-280 caracteres)
 * @property {UpdateCommentRateRequestDto} rate - Avaliações opcionais do toilet
 *
 * @example
 * {
 *   "text": "Instalações ainda mais limpas após reforma!",
 *   "rate": {
 *     "clean": 5,
 *     "structure": 5
 *   }
 * }
 */
export class UpdateCommentRequestDto {
  /**
   * Texto opcional do comentário
   *
   * @type {string}
   * @length 1-280
   * @description Novo texto do comentário (se fornecido)
   * @example "Instalações ainda mais limpas após reforma!"
   */
  @ApiProperty({ required: false })
  @IsString()
  @MinLength(1)
  @MaxLength(280)
  @IsOptional()
  @Type(() => String)
  text?: string;

  /**
   * Avaliações do toilet
   *
   * @type {UpdateCommentRateRequestDto}
   * @description Avaliações parciais para atualização (apenas campos fornecidos serão alterados)
   */
  @ApiProperty({ required: false })
  @ValidateNested()
  @IsOptional()
  @Type(() => CreateCommentRateRequestDto)
  rate?: UpdateCommentRateRequestDto;
}
