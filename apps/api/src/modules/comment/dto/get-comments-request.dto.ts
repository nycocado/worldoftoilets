import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO de Request para Listar Comentários (Público)
 *
 * @class GetCommentsRequestDto
 * @description Transfer Object para requisição de listagem paginada de comentários públicos
 *
 * @property {boolean} pageable - Indica se deve paginar os resultados (padrão: true)
 * @property {number} page - Número da página (padrão: 0)
 * @property {number} size - Tamanho da página (padrão: 20)
 * @property {Date} timestamp - Timestamp de referência para paginação (padrão: agora)
 *
 * @example
 * {
 *   "pageable": true,
 *   "page": 0,
 *   "size": 20,
 *   "timestamp": "2025-11-14T10:30:00Z"
 * }
 */
export class GetCommentsRequestDto {
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
   * @description Número de comentários por página
   * @default 20
   * @example 20
   */
  @ApiProperty({ required: false, default: 20 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  size?: number = 20;

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
