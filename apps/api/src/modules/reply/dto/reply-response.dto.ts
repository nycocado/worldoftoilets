import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserCommentResponseDto } from '@modules/user/dto/user-comment-response.dto';

/**
 * DTO para a resposta de uma resposta a um comentário.
 */
export class ReplyResponseDto {
  @ApiProperty({
    description: 'O ID público da resposta.',
    format: 'uuid',
  })
  @Expose()
  @Type(() => String)
  publicId!: string;

  @ApiProperty({
    description: 'O texto da resposta.',
  })
  @Expose()
  @Type(() => String)
  text!: string;

  @ApiProperty({
    description: 'O autor da resposta.',
    type: () => UserCommentResponseDto,
  })
  @Expose()
  @Type(() => UserCommentResponseDto)
  user!: UserCommentResponseDto;

  @ApiProperty({
    description: 'A data de criação da resposta.',
    format: 'date-time',
  })
  @Expose()
  @Type(() => Date)
  createdAt!: Date;
}
