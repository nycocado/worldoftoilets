import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO Base para Utilizador
 *
 * @class UserBaseDto
 * @description Transfer Object base com informações públicas do utilizador
 *
 * @property {string} publicId - ID público UUID do utilizador
 * @property {string} name - Nome de utilizador (display name)
 * @property {string} icon - Ícone/avatar do utilizador
 * @property {number} commentCount - Total de comentários feitos pelo utilizador
 *
 * @example
 * {
 *  "publicId": "550e8400-e29b-41d4-a716-446655440000",
 *  "name": "João Silva",
 *  "icon": "icon-1",
 *  "commentCount": 42
 *  }
 */
export class UserBaseDto {
  /**
   * ID público do utilizador em formato UUID
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
   * Nome de utilizador (display name/alcunha)
   *
   * @type {string}
   * @example "João Silva"
   */
  @ApiProperty()
  @Expose()
  @Type(() => String)
  name!: string;

  /**
   * Ícone/avatar do utilizador
   *
   * @type {string}
   * @description Identificador do avatar escolhido pelo utilizador
   * @example "icon-1"
   */
  @ApiProperty()
  @Expose()
  @Type(() => String)
  icon!: string;

  /**
   * Número de comentários feitos pelo utilizador
   *
   * @type {number}
   * @description Total de comentários associados ao utilizador
   * @example 42
   */
  @ApiProperty()
  @Expose()
  @Type(() => Number)
  commentsCount!: number;
}
