import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO de Request para Login
 *
 * @class LoginRequestDto
 * @description Transfer Object para requisição de autenticação (login)
 *
 * @property {string} email - Email do utilizador (3-100 caracteres)
 * @property {string} password - Password do utilizador (8-64 caracteres)
 *
 * @example
 * {
 *   "email": "joao@example.com",
 *   "password": "MySecurePass123"
 * }
 */
export class LoginRequestDto {
  /**
   * Email do utilizador
   *
   * @type {string}
   * @length 3-100
   * @format email
   * @example "joao@example.com"
   */
  @ApiProperty()
  @IsEmail()
  @MinLength(3)
  @MaxLength(100)
  @IsNotEmpty()
  @Type(() => String)
  email!: string;

  /**
   * Password do utilizador
   *
   * @type {string}
   * @length 8-64
   * @description Password em texto plano. Será validada contra hash da password armazenada.
   * @example "MySecurePass123"
   */
  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  @IsNotEmpty()
  @Type(() => String)
  password!: string;
}
