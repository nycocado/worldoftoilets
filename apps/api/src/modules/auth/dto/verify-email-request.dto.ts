import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de Request para Verificação de Email
 *
 * @class VerifyEmailRequestDto
 * @description Transfer Object para verificação de email via token enviado por email
 *
 * @property {string} token - Token UUID de verificação recebido no email
 *
 * @example
 * {
 *   "token": "550e8400-e29b-41d4-a716-446655440000"
 * }
 */
export class VerifyEmailRequestDto {
  /**
   * Token de verificação de email
   *
   * @type {string}
   * @format uuid
   * @description Token único gerado durante o registo e enviado para o email do utilizador.
   * Deve ser fornecido como query parameter: ?token=<uuid>
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  @ApiProperty()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  token!: string;
}
