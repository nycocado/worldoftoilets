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
import { Type } from 'class-transformer';

/**
 * DTO para a requisição de registo de uma nova conta.
 */
export class RegisterRequestDto {
  @ApiProperty({
    description: 'O nome completo do utilizador.',
    example: 'John Doe',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty()
  @Type(() => String)
  name!: string;

  @ApiProperty({
    description: 'O endereço de email do utilizador.',
    example: 'john.doe@example.com',
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
    example: 'SecurePassword123!',
    minLength: 8,
    maxLength: 64,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  @IsNotEmpty()
  @Type(() => String)
  password!: string;

  @ApiProperty({
    required: false,
    enum: UserIcon,
    description: 'O ícone de perfil do utilizador.',
    example: UserIcon.ICON_DEFAULT,
  })
  @IsEnum(UserIcon)
  @IsOptional()
  icon?: UserIcon;

  @ApiProperty({
    description: 'A data de nascimento do utilizador no formato ISO 8601.',
    example: '1990-01-01T00:00:00.000Z',
    format: 'date-time',
  })
  @IsDateString()
  @IsNotEmpty()
  @Type(() => String)
  birthDate!: string;
}
