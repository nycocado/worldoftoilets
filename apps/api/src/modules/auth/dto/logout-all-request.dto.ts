import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID, MaxLength, MinLength } from 'class-validator';

/**
 * DTO de Request para Logout de Todas as Sessões
 *
 * @class LogoutAllRequestDto
 * @description Transfer Object para logout global (todas as sessões)
 *
 * @property {string} refreshToken - Token UUID para identificar utilizador (opcional, obtido de cookie por defeito)
 *
 * @example
 * {
 *   "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
 * }
 */
export class LogoutAllRequestDto {
  /**
   * Token de refresh para identificar utilizador
   *
   * @type {string}
   * @format uuid
   * @optional
   * @description Refresh token válido do utilizador. Será usado para identificar qual utilizador
   * fazer logout de todas as sessões. Se não fornecido, será extraído do cookie.
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
