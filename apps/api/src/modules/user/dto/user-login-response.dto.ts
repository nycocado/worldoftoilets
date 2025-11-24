import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserBaseDto } from '@modules/user/dto/user-base.dto';

/**
 * DTO para a resposta com os dados do utilizador após o login.
 */
export class UserLoginResponseDto extends UserBaseDto {
  @ApiProperty({
    description: 'O email do utilizador.',
    example: 'user@example.com',
  })
  @Expose()
  @Type(() => String)
  email: string;
}
