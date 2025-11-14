import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCommentRateRequestDto } from '@modules/comment/dto/create-comment-rate-request.dto';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de Request para Criar Comentário
 *
 * @class CreateCommentRequestDto
 * @description Transfer Object para requisição de criação de novo comentário
 *
 * @property {string} toiletPublicId - ID público UUID do toilet a avaliar
 * @property {string} text - Texto opcional do comentário (1-280 caracteres)
 * @property {CreateCommentRateRequestDto} rate - Avaliações obrigatórias do toilet
 *
 * @example
 * {
 *   "toiletPublicId": "550e8400-e29b-41d4-a716-446655440000",
 *   "text": "Instalações muito limpas e bem mantidas!",
 *   "rate": {
 *     "clean": 5,
 *     "paper": true,
 *     "structure": 4,
 *     "accessibility": 5
 *   }
 * }
 */
export class CreateCommentRequestDto {
  /**
   * ID público do toilet a avaliar
   *
   * @type {string}
   * @format uuid
   * @description Identificador do toilet que está a ser comentado
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  @Type(() => String)
  toiletPublicId!: string;

  /**
   * Texto opcional do comentário
   *
   * @type {string}
   * @length 1-280
   * @description Comentário textual opcional do utilizador sobre o toilet
   * @example "Instalações muito limpas e bem mantidas!"
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
   * @type {CreateCommentRateRequestDto}
   * @description Avaliações obrigatórias de limpeza, papel, estrutura e acessibilidade
   */
  @ApiProperty()
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => CreateCommentRateRequestDto)
  rate!: CreateCommentRateRequestDto;
}
