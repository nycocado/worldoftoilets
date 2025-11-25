import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para a operação de criação de uma nova resposta.
 */
export class CreateReplyRequestDto {
  @ApiProperty({
    description: 'O ID público do comentário a ser respondido.',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  @Type(() => String)
  commentPublicId!: string;

  @ApiProperty({
    description: 'O texto da resposta.',
    minLength: 1,
    maxLength: 280,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(280)
  @IsNotEmpty()
  @Type(() => String)
  text!: string;
}
