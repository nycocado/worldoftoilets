import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserLoginResponseDto } from '@modules/user/dto';

/**
 * DTO para a resposta de login bem-sucedido.
 */
export class LoginResponseDto {
  @ApiProperty({
    description: 'O token de acesso JWT.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @Expose()
  @Type(() => String)
  accessToken: string;

  @ApiProperty({
    description: 'O refresh token JWT.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @Expose()
  @Type(() => String)
  refreshToken: string;

  @ApiProperty({
    description: 'Os dados do utilizador logado.',
    type: () => UserLoginResponseDto,
  })
  @Expose()
  @Type(() => UserLoginResponseDto)
  user: UserLoginResponseDto;
}
