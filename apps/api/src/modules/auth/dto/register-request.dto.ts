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

export class RegisterRequestDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty()
  name!: string;

  @ApiProperty()
  @IsEmail()
  @MinLength(3)
  @MaxLength(100)
  @IsNotEmpty()
  email!: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  @IsNotEmpty()
  password!: string;

  @ApiProperty()
  @IsEnum(UserIcon)
  @IsOptional()
  icon?: UserIcon;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  birthDate!: string;
}
