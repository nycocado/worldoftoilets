import { RegisterRequestDto } from '@modules/auth/dto/register-request.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Enum de Tipos de Role Administrativas
 *
 * @enum {string}
 * @description Define os tipos de roles administrativas disponíveis no sistema
 *
 * @property {string} COMMENTS_ADMINISTRATOR - Administrador de comentários
 * @property {string} TOILETS_ADMINISTRATOR - Administrador de casas de banho
 * @property {string} PARTNERS_ADMINISTRATOR - Administrador de parceiros
 * @property {string} DEAD_ADMINISTRATOR - Administrador inativo/desativado
 */
export enum RoleType {
  COMMENTS_ADMINISTRATOR = 'comments-administrator',
  TOILETS_ADMINISTRATOR = 'toilets-administrator',
  PARTNERS_ADMINISTRATOR = 'partners-administrator',
  DEAD_ADMINISTRATOR = 'dead-administrator',
}

/**
 * DTO de Request para Registo de Administrador
 *
 * @class RegisterAdminRequestDto
 * @description Transfer Object para requisição de registo de nova conta administrativa.
 * Estende o registo normal com atribuição de roles administrativas específicas.
 *
 * @property {RegisterRequestDto} user - Dados básicos de registo do utilizador
 * @property {RoleType[]} roles - Lista de roles administrativas a atribuir
 *
 * @example
 * {
 *   "user": {
 *     "name": "Admin João",
 *     "email": "admin@example.com",
 *     "password": "MySecurePass123",
 *     "icon": "icon-1",
 *     "birthDate": "1990-01-15"
 *   },
 *   "roles": ["comments-administrator", "users-administrator"]
 * }
 */
export class RegisterAdminRequestDto {
  /**
   * Dados de registo do utilizador
   *
   * @type {RegisterRequestDto}
   * @description Objeto contendo name, email, password, icon e birthDate
   * @example { "name": "Admin João", "email": "admin@example.com", "password": "MySecurePass123", "icon": "icon-1", "birthDate": "1990-01-15" }
   */
  @ApiProperty()
  @ValidateNested()
  @Type(() => RegisterRequestDto)
  @IsNotEmpty()
  user!: RegisterRequestDto;

  /**
   * Roles administrativas a atribuir
   *
   * @type {RoleType[]}
   * @description Array de roles administrativas. Pode conter uma ou mais roles.
   * @example ["comments-administrator", "users-administrator"]
   */
  @ApiProperty()
  @IsArray()
  @IsEnum(RoleType)
  @IsNotEmpty()
  roles!: RoleType[];
}
