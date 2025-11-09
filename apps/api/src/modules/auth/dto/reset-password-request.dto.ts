import {
  IsString,
  IsUUID,
  MinLength,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * DTO de Request para Reset de Password
 *
 * @class ResetPasswordRequestDto
 * @description Transfer Object para efectuar reset de password
 *
 * @property {string} token - Token UUID de reset obtido no email
 * @property {string} newPassword - Nova password (8-64 caracteres)
 *
 * @example
 * {
 *   "token": "550e8400-e29b-41d4-a716-446655440000",
 *   "newPassword": "NewSecurePass456"
 * }
 */
export class ResetPasswordRequestDto {
  /**
   * Token de reset de password
   *
   * @type {string}
   * @format uuid
   * @description Token único gerado por forgot-password e enviado no email.
   * Deve ser incluído no body da requisição POST /auth/reset-password.
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  @ApiProperty()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  @Type(() => String)
  token!: string;

  /**
   * Nova password do utilizador
   *
   * @type {string}
   * @length 8-64
   * @description Nova password em texto plano. Será hasheada com bcrypt.
   * Deve ser diferente da password anterior.
   * @example "NewSecurePass456"
   */
  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  @IsNotEmpty()
  @Type(() => String)
  newPassword!: string;
}
