import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserBaseDto } from '@modules/user/dto/user-base.dto';

/**
 * DTO para a resposta de dados de utilizador em uma sugestão.
 */
export class UserSuggestionResponseDto extends UserBaseDto {
  @ApiProperty({
    description: 'O email do utilizador.',
    example: 'user@example.com',
  })
  @Expose()
  @Type(() => String)
  email: string;
}
