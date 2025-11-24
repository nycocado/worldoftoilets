import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCommentRateRequestDto } from '@modules/comment/dto/create-comment-rate-request.dto';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para a operação de criação de um novo comentário.
 */
export class CreateCommentRequestDto {
  @ApiProperty({
    description: 'O ID público do sanitário que está a ser comentado.',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  @Type(() => String)
  toiletPublicId!: string;

  @ApiProperty({
    required: false,
    description: 'O texto opcional do comentário.',
    example: 'Instalações muito limpas e bem mantidas!',
    minLength: 1,
    maxLength: 280,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(280)
  @IsOptional()
  @Type(() => String)
  text?: string;

  @ApiProperty({
    type: CreateCommentRateRequestDto,
    description: 'As avaliações de limpeza, papel, estrutura e acessibilidade.',
  })
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => CreateCommentRateRequestDto)
  rate!: CreateCommentRateRequestDto;
}
