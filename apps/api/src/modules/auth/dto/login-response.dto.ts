import { IsNotEmpty, IsString, IsObject } from 'class-validator';
import { UserIcon } from '@database/entities';

export class UserDataDto {
  @IsString()
  @IsNotEmpty()
  publicId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  icon: UserIcon;
}

export class LoginResponseDto {
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  @IsObject()
  @IsNotEmpty()
  user: UserDataDto;
}
