import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

/**
 * DTO para a resposta de renovação de token.
 */
export class RefreshTokenResponseDto {
  @ApiProperty({
    description: 'O token de acesso JWT renovado.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @Expose()
  @Type(() => String)
  accessToken: string;

  @ApiProperty({
    description: 'O refresh token JWT renovado.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @Expose()
  @Type(() => String)
  refreshToken: string;
}
