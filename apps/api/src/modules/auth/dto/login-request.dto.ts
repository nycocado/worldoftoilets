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
 * DTO para a requisição de login.
 */
export class LoginRequestDto {
  @ApiProperty({
    description: 'O endereço de email do utilizador.',
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

  @ApiProperty({
    description: 'A password do utilizador.',
    example: 'Password123!',
    minLength: 8,
    maxLength: 64,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  @IsNotEmpty()
  @Type(() => String)
  password!: string;
}
