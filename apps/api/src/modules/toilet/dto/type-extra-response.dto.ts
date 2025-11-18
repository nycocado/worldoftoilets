import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de Response para Tipo de Extra
 *
 * @class TypeExtraResponseDto
 * @description Transfer Object para resposta com dados de extras/amenidades do toilet
 *
 * @property {string} name - Nome legível do extra
 * @property {string} apiName - Nome da API (enum) do extra
 *
 * @example
 * {
 *   "name": "Wi-Fi",
 *   "apiName": "WIFI"
 * }
 */
export class TypeExtraResponseDto {
  /**
   * Nome legível do extra
   *
   * @type {string}
   * @description Nome traduzido do extra para exibição
   * @example "Wi-Fi"
   */
  @ApiProperty()
  @Expose()
  name!: string;

  /**
   * Nome da API do extra
   *
   * @type {string}
   * @description Identificador enum do extra (WIFI, ACCESSIBLE, BABY_CHANGING, etc.)
   * @example "WIFI"
   */
  @ApiProperty()
  @Expose()
  apiName!: string;
}
