import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * DTO de Response para Refresh Token
 *
 * @class RefreshTokenResponseDto
 * @description Transfer Object para resposta de renovação de token
 *
 * @property {string} accessToken - Novo JWT access token
 * @property {string} refreshToken - Novo JWT refresh token (se renovado)
 *
 * @example
 * {
 *   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
 * }
 */
export class RefreshTokenResponseDto {
  /**
   * Novo token de acesso JWT
   *
   * @type {string}
   * @description Novo JWT para autenticação nos endpoints protegidos.
   * Substitui o access token anterior. Configurável via JWT_EXPIRATION.
   */
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  accessToken: string;

  /**
   * Novo token de refresh JWT (se renovado)
   *
   * @type {string}
   * @format uuid
   * @description Novo refresh token se próximo de expirar, ou mantém o anterior.
   * Usado para futuras renovações de access token.
   */
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  @Type(() => String)
  refreshToken: string;
}
