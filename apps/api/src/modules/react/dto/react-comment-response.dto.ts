import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para a resposta com a contagem de reações de um comentário.
 */
export class ReactCommentResponseDto {
  @ApiProperty()
  likes: number;

  @ApiProperty()
  dislikes: number;
}
