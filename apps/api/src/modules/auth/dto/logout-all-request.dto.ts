import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LogoutAllRequestDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}
