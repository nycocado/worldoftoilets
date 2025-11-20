import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

/**
 * DTO para a requisição de desativação da própria conta.
 */
export class DeleteUserSelfRequestDto {
  @ApiProperty({
    description: 'Senha atual do utilizador para confirmação.',
    example: 'MinhaSenh@123',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password!: string;
}
