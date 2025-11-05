import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID, MaxLength, MinLength } from 'class-validator';

export class RefreshTokenRequestDto {
  @ApiProperty({
    required: false,
    description:
      'Refresh token para renovar o token de acesso. Se não for fornecido, será usado o cookie.',
  })
  @IsUUID()
  @MinLength(3)
  @MaxLength(36)
  @IsOptional()
  refreshToken?: string;
}
