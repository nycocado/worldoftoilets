import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de Request para Recuperação de Password
 *
 * @class ForgotPasswordRequestDto
 * @description Transfer Object para solicitar recuperação de password
 *
 * @property {string} email - Email do utilizador (3-100 caracteres)
 *
 * @example
 * {
 *   "email": "joao@example.com"
 * }
 */
export class ForgotPasswordRequestDto {
  /**
   * Email do utilizador
   *
   * @type {string}
   * @length 3-100
   * @format email
   * @description Email para o qual será enviado o link de reset de password.
   * Por segurança, retorna sucesso mesmo se email não existir.
   * @example "joao@example.com"
   */
  @ApiProperty()
  @IsEmail()
  @MinLength(3)
  @MaxLength(100)
  @IsNotEmpty()
  email!: string;
}
