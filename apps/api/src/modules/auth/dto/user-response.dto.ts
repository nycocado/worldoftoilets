import { ApiProperty } from '@nestjs/swagger';
import { UserIcon } from '@database/entities';
import { Expose, Type } from 'class-transformer';

/**
 * DTO com Dados de Utilizador (Login Response)
 *
 * @class UserResponseDto
 * @description Transfer Object com informações públicas do utilizador autenticado
 *
 * @property {string} publicId - ID público UUID do utilizador
 * @property {string} name - Nome de utilizador (display name)
 * @property {string} email - Email do utilizador
 * @property {UserIcon} icon - Ícone/avatar do utilizador
 */
export class UserResponseDto {
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
  publicId: string;

  /**
   * Nome de utilizador (display name/alcunha)
   *
   * @type {string}
   * @example "João Silva"
   */
  @ApiProperty()
  @Expose()
  @Type(() => String)
  name: string;

  /**
   * Email do utilizador
   *
   * @type {string}
   * @format email
   * @example "joao@example.com"
   */
  @ApiProperty()
  @Expose()
  @Type(() => String)
  email: string;

  /**
   * Ícone/avatar do utilizador
   *
   * @type {UserIcon}
   * @description Avatar escolhido pelo utilizador durante o registo
   * @example "icon-1"
   */
  @ApiProperty()
  @Expose()
  @Type(() => String)
  icon: UserIcon;

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
