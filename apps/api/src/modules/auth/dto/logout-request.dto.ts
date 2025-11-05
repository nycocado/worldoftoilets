import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID, MaxLength, MinLength } from 'class-validator';

export class LogoutRequestDto {
  @ApiProperty()
  @IsUUID()
  @MinLength(3)
  @MaxLength(36)
  @IsOptional()
  refreshToken?: string;
}
