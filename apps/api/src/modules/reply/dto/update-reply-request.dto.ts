import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para a operação de atualização de uma resposta.
 */
export class UpdateReplyRequestDto {
  @ApiProperty({
    description: 'O novo texto da resposta.',
    minLength: 1,
    maxLength: 280,
    required: false,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(280)
  @IsOptional()
  @Type(() => String)
  text?: string;
}
