import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { UserIcon } from '@database/entities';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de Request para Registo
 *
 * @class RegisterRequestDto
 * @description Transfer Object para requisição de registo de nova conta
 *
 * @property {string} name - Nome de utilizador (2-50 caracteres)
 * @property {string} email - Email (3-100 caracteres)
 * @property {string} password - Password (8-64 caracteres)
 * @property {UserIcon} icon - Ícone/avatar (opcional, default: ICON_DEFAULT)
 * @property {string} birthDate - Data de nascimento em formato ISO (YYYY-MM-DD)
 *
 * @example
 * {
 *   "name": "João Silva",
 *   "email": "joao@example.com",
 *   "password": "MySecurePass123",
 *   "icon": "icon-1",
 *   "birthDate": "1990-01-15"
 * }
 */
export class RegisterRequestDto {
  /**
   * Nome de utilizador (display name/alcunha)
   *
   * @type {string}
   * @length 2-50
   * @example "João Silva"
   */
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty()
  name!: string;

  /**
   * Email do utilizador
   *
   * @type {string}
   * @length 3-100
   * @format email
   * @description Deve ser único no sistema, irá receber email de verificação
   * @example "joao@example.com"
   */
  @ApiProperty()
  @IsEmail()
  @MinLength(3)
  @MaxLength(100)
  @IsNotEmpty()
  email!: string;

  /**
   * Password do utilizador
   *
   * @type {string}
   * @length 8-64
   * @description Password em texto plano. Será hasheada com bcrypt antes de armazenar.
   * @example "MySecurePass123"
   */
  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  @IsNotEmpty()
  password!: string;

  /**
   * Ícone/avatar do utilizador
   *
   * @type {UserIcon}
   * @optional
   * @description Avatar escolhido pelo utilizador. Se omitido, default para ICON_DEFAULT.
   * @example "icon-1"
   */
  @ApiProperty()
  @IsEnum(UserIcon)
  @IsOptional()
  icon?: UserIcon;

  /**
   * Data de nascimento do utilizador
   *
   * @type {string}
   * @format date (ISO 8601)
   * @description Data em formato YYYY-MM-DD para confirmação de idade
   * @example "1990-01-15"
   */
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  birthDate!: string;
}
