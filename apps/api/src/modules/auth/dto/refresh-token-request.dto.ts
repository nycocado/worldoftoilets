import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID, MaxLength, MinLength } from 'class-validator';

/**
 * DTO de Request para Refresh Token
 *
 * @class RefreshTokenRequestDto
 * @description Transfer Object para renovação de access token via refresh token
 *
 * @property {string} refreshToken - Token UUID (opcional, obtido de cookie por defeito)
 *
 * @example
 * {
 *   "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
 * }
 */
export class RefreshTokenRequestDto {
  /**
   * Token de refresh para renovação
   *
   * @type {string}
   * @format uuid
   * @optional
   * @description Refresh token válido. Se não fornecido, será extraído do cookie.
   * Pode ser fornecido como query parameter: ?refreshToken=<uuid>
   * ou será automaticamente obtido do cookie 'refreshToken'.
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  @ApiProperty({
    required: false,
    description:
      'Refresh token para renovar o token de acesso. Se não for fornecido, será usado o cookie.',
  })
  @IsUUID()
  @MinLength(3)
  @MaxLength(36)
  @IsOptional()
  refreshToken?: string;
}
