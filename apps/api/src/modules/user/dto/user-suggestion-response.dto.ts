import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserBaseDto } from '@modules/user/dto/user-base.dto';

/**
 * DTO com Dados de Utilizador (Suggestion Response)
 *
 * @class UserLoginResponseDto
 * @description Transfer Object com informações públicas do utilizador autenticado
 *
 * @property {string} publicId - ID público UUID do utilizador
 * @property {string} name - Nome de utilizador (display name)
 * @property {string} email - Email do utilizador
 * @property {UserIcon} icon - Ícone/avatar do utilizador
 */
export class UserSuggestionResponseDto extends UserBaseDto {
  /**
   * Email do utilizador
   *
   * @type {string}
   * @format email
   * @example "joao@example.com"
   */
  @ApiProperty()
  @Expose()
  @Type(() => String)
  email: string;
}
