import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '@modules/auth/dto/user-response.dto';
import { Expose, Type } from 'class-transformer';

/**
 * DTO de Response para Login
 *
 * @class LoginResponseDto
 * @description Transfer Object para resposta de autenticação bem-sucedida
 *
 * @property {string} accessToken - JWT Token para acesso à API (curta vida)
 * @property {string} refreshToken - JWT Token para renovação (longa vida)
 * @property {UserResponseDto} user - Dados públicos do utilizador autenticado
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
  @Expose()
  @Type(() => String)
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
  @Expose()
  @Type(() => String)
  refreshToken: string;

  /**
   * Dados públicos do utilizador autenticado
   *
   * @type {UserResponseDto}
   * @description Informações do utilizador para utilização no cliente
   */
  @ApiProperty()
  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;
}
