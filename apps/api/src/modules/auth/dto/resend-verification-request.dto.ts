import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * DTO para solicitar o reenvio do email de verificação.
 */
export class ResendVerificationRequestDto {
  @ApiProperty({
    description:
      'O endereço de email do utilizador para reenviar a verificação.',
    example: 'user@example.com',
    minLength: 3,
    maxLength: 100,
  })
  @IsEmail()
  @MinLength(3)
  @MaxLength(100)
  @IsNotEmpty()
  @Type(() => String)
  email!: string;
}
