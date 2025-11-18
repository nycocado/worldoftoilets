import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de Response para Tipo de Acesso
 *
 * @class AccessResponseDto
 * @description Transfer Object para resposta com dados do tipo de acesso do toilet
 *
 * @property {string} name - Nome legível do tipo de acesso
 * @property {string} apiName - Nome da API (enum) do tipo de acesso
 *
 * @example
 * {
 *   "name": "Público",
 *   "apiName": "PUBLIC"
 * }
 */
export class AccessResponseDto {
  /**
   * Nome legível do tipo de acesso
   *
   * @type {string}
   * @description Nome traduzido do tipo de acesso para exibição
   * @example "Público"
   */
  @ApiProperty()
  @Expose()
  name!: string;

  /**
   * Nome da API do tipo de acesso
   *
   * @type {string}
   * @description Identificador enum do tipo de acesso (PUBLIC, PRIVATE, CUSTOMERS_ONLY)
   * @example "PUBLIC"
   */
  @ApiProperty()
  @Expose()
  apiName!: string;
}
