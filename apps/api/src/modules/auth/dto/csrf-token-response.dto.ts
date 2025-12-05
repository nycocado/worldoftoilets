import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

/**
 * DTO para a resposta do token CSRF.
 */
export class CsrfTokenResponseDto {
  @ApiProperty({
    description: 'O token CSRF para proteção contra ataques CSRF.',
    example: 'abc123def456...',
  })
  @Expose()
  @Type(() => String)
  csrfToken: string;
}
