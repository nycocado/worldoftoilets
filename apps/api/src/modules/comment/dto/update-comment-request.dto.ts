import { UpdateCommentRateRequestDto } from '@modules/comment/dto/update-comment-rate-request.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCommentRateRequestDto } from '@modules/comment/dto/create-comment-rate-request.dto';

/**
 * DTO para a operação de atualização de um comentário.
 */
export class UpdateCommentRequestDto {
  @ApiProperty({
    required: false,
    description: 'O novo texto do comentário.',
    example: 'Instalações ainda mais limpas após reforma!',
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
    required: false,
    type: CreateCommentRateRequestDto,
    description: 'As novas avaliações para o comentário.',
  })
  @ValidateNested()
  @IsOptional()
  @Type(() => CreateCommentRateRequestDto)
  rate?: UpdateCommentRateRequestDto;
}
