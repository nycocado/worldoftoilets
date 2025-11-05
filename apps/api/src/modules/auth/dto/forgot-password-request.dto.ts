import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordRequestDto {
  @ApiProperty()
  @IsEmail()
  @MinLength(3)
  @MaxLength(100)
  @IsNotEmpty()
  email!: string;
}
