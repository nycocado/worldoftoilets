import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de Request para Reenvio de Email de Verificação
 *
 * @class ResendVerificationRequestDto
 * @description Transfer Object para solicitar reenvio do email de verificação
 *
 * @property {string} email - Email do utilizador (3-100 caracteres)
 *
 * @example
 * {
 *   "email": "joao@example.com"
 * }
 */
export class ResendVerificationRequestDto {
  /**
   * Email do utilizador
   *
   * @type {string}
   * @length 3-100
   * @format email
   * @description Email para o qual será reenviado o email de verificação.
   * Apenas funciona se a conta existe e email não foi verificado.
   * @example "joao@example.com"
   */
  @ApiProperty()
  @IsEmail()
  @MinLength(3)
  @MaxLength(100)
  @IsNotEmpty()
  email!: string;
}
