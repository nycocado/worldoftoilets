import {
  IsString,
  IsUUID,
  MinLength,
  MaxLength,
  IsNotEmpty,
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
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  @IsNotEmpty()
  @Type(() => String)
  newPassword!: string;
}
