import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID, MaxLength, MinLength } from 'class-validator';

/**
 * DTO de Request para Logout de Sessão Específica
 *
 * @class LogoutRequestDto
 * @description Transfer Object para logout de uma sessão específica
 *
 * @property {string} refreshToken - Token UUID a revogar (opcional, obtido de cookie por defeito)
 *
 * @example
 * {
 *   "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
 * }
 */
export class LogoutRequestDto {
  /**
   * Token de refresh a revogar
   *
   * @type {string}
   * @format uuid
   * @optional
   * @description Refresh token da sessão a encerrar. Se não fornecido, será extraído do cookie.
   * Pode ser fornecido como query parameter: ?refreshToken=<uuid>
   * ou será automaticamente obtido do cookie 'refreshToken'.
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  @ApiProperty()
  @IsUUID()
  @MinLength(3)
  @MaxLength(36)
  @IsOptional()
  refreshToken?: string;
}
