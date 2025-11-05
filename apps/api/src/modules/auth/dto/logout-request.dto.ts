import { ApiProperty } from '@nestjs/swagger';

export class LogoutRequestDto {
  @ApiProperty()
  refreshToken?: string;
}
