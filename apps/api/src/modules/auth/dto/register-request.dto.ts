import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsDateString,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { UserIcon } from '@database/entities';

export class RegisterRequestDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @IsNotEmpty()
  password!: string;

  @IsString()
  @IsEnum(UserIcon)
  icon?: UserIcon;

  @IsDateString()
  @IsNotEmpty()
  birthDate!: string;
}
