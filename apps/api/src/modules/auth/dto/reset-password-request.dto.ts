import {
  IsString,
  IsUUID,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * DTO para efetuar o reset da password.
 */
export class ResetPasswordRequestDto {
  @ApiProperty({
    description: 'O token UUID de redefinição de password.',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  @Type(() => String)
  token!: string;

  @ApiProperty({
    description: 'A nova password do utilizador.',
    example: 'NewPassword123!',
    minLength: 8,
    maxLength: 64,
  })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password too weak. It must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.',
    },
  )
  @MaxLength(64)
  @IsNotEmpty()
  @Type(() => String)
  newPassword!: string;
}
