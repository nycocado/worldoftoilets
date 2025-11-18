import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ReplyState } from '@database/entities';

/**
 * DTO de Request para Listar Respostas (Moderação)
 *
 * @class GetRepliesManageRequestDto
 * @description Transfer Object para requisição de listagem paginada de respostas em moderação
 *
 * @property {boolean} pageable - Indica se deve paginar os resultados (padrão: true)
 * @property {number} page - Número da página (padrão: 0)
 * @property {number} size - Tamanho da página (padrão: 20)
 * @property {ReplyState} replyState - Estado das respostas a buscar
 * @property {Date} timestamp - Timestamp de referência para paginação (padrão: agora)
 *
 * @example
 * {
 *   "pageable": true,
 *   "page": 0,
 *   "size": 20,
 *   "replyState": "visible",
 *   "timestamp": "2025-11-14T10:30:00Z"
 * }
 */
export class GetRepliesManageRequestDto {
  /**
   * Indica se deve paginar os resultados
   *
   * @type {boolean}
   * @description Ativa/desativa paginação dos resultados
   * @default true
   * @example true
   */
  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  pageable?: boolean = true;

  /**
   * Número da página
   *
   * @type {number}
   * @description Índice da página para paginação (baseado em 0)
   * @default 0
   * @example 0
   */
  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 0;

  /**
   * Tamanho da página
   *
   * @type {number}
   * @description Número de respostas por página
   * @default 20
   * @example 20
   */
  @ApiProperty({ required: false, default: 20 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  size?: number = 20;

  /**
   * Estado das respostas a buscar
   *
   * @type {ReplyState}
   * @enum ReplyState
   * @description Filtra respostas por estado (VISIBLE ou HIDDEN)
   * @example "visible"
   */
  @ApiProperty({ required: false, enum: ReplyState })
  @IsOptional()
  @IsEnum(ReplyState)
  @Type(() => String)
  replyState?: ReplyState;

  /**
   * Timestamp de referência
   *
   * @type {Date}
   * @format date-time
   * @description Timestamp de referência para paginação baseada em tempo
   * @default new Date()
   * @example "2025-11-14T10:30:00Z"
   */
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  timestamp?: Date = new Date();
}
