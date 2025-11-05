import { IsString, IsUUID, MinLength, MaxLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsUUID()
  token!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  newPassword!: string;
}
