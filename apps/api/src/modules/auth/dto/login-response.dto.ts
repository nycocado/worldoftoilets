import {
  IsNotEmpty,
  IsString,
  IsObject,
  IsEmail,
  IsUUID,
} from 'class-validator';
import { UserIcon } from '@database/entities';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO com Dados de Utilizador (Login Response)
 *
 * @class UserDataDto
 * @description Transfer Object com informações públicas do utilizador autenticado
 *
 * @property {string} publicId - ID público UUID do utilizador
 * @property {string} name - Nome de utilizador (display name)
 * @property {string} email - Email do utilizador
 * @property {UserIcon} icon - Ícone/avatar do utilizador
 */
export class UserDataDto {
  /**
   * ID público do utilizador em formato UUID
   *
   * @type {string}
   * @format uuid
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  publicId: string;

  /**
   * Nome de utilizador (display name/alcunha)
   *
   * @type {string}
   * @example "João Silva"
   */
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * Email do utilizador
   *
   * @type {string}
   * @format email
   * @example "joao@example.com"
   */
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * Ícone/avatar do utilizador
   *
   * @type {UserIcon}
   * @description Avatar escolhido pelo utilizador durante o registo
   * @example "icon-1"
   */
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  icon: UserIcon;
}

/**
 * DTO de Response para Login
 *
 * @class LoginResponseDto
 * @description Transfer Object para resposta de autenticação bem-sucedida
 *
 * @property {string} accessToken - JWT Token para acesso à API (curta vida)
 * @property {string} refreshToken - JWT Token para renovação (longa vida)
 * @property {UserDataDto} user - Dados públicos do utilizador autenticado
 *
 * @example
 * {
 *   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
 *   "user": {
 *     "publicId": "550e8400-e29b-41d4-a716-446655440000",
 *     "name": "João Silva",
 *     "email": "joao@example.com",
 *     "icon": "icon-1"
 *   }
 * }
 */
export class LoginResponseDto {
  /**
   * Token de acesso JWT
   *
   * @type {string}
   * @description Token para autenticação nos endpoints protegidos
   * Vida útil curta (ex: 15 minutos) configurável em JWT_EXPIRATION
   */
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  /**
   * Token de refresh JWT
   *
   * @type {string}
   * @format uuid
   * @description Token para renovar access token sem novo login
   * Vida útil longa (ex: 30 dias) configurável em JWT_REFRESH_EXPIRATION
   */
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  refreshToken: string;

  /**
   * Dados públicos do utilizador autenticado
   *
   * @type {UserDataDto}
   * @description Informações do utilizador para utilização no cliente
   */
  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  user: UserDataDto;
}
