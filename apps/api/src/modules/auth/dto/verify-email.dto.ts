import { IsString, IsUUID } from 'class-validator';

export class VerifyEmailDto {
  @IsString()
  @IsUUID()
  token!: string;
}
