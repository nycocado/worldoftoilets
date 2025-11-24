import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ReactType {
  LIKE = 'like',
  DISLIKE = 'dislike',
}

/**
 * DTO para a operação de reagir a um comentário.
 */
export class PutReactRequestDto {
  @ApiProperty({
    enum: ReactType,
    description: 'O tipo de reação (like ou dislike).',
    example: 'like',
  })
  @IsEnum(ReactType)
  @IsNotEmpty()
  react!: ReactType;
}
