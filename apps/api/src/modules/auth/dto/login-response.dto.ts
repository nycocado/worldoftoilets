import { IsNotEmpty, IsString, IsObject } from 'class-validator';
import { UserIcon } from '@database/entities';
import { ApiProperty } from '@nestjs/swagger';

export class UserDataDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  publicId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  icon: UserIcon;
}

export class LoginResponseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  user: UserDataDto;
}
