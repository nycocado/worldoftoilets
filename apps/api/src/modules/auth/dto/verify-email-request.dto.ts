import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailRequestDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  token!: string;
}
