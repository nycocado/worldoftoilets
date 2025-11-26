import { Expose, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CommentRateCommentResponseDto } from '@modules/comment-rate/dto/comment-rate-comment-response.dto';
import { ReactCommentResponseDto } from '@modules/react/dto/react-comment-response.dto';
import { UserCommentResponseDto } from '@modules/user/dto/user-comment-response.dto';
import { ReactType } from '@modules/comment/dto/put-react-request.dto';

/**
 * DTO para a resposta de um comentário.
 */
export class CommentResponseDto {
  @ApiProperty({
    description: 'O ID público do comentário.',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @Expose()
  @Type(() => String)
  publicId!: string;

  @ApiProperty({
    description: 'O texto do comentário.',
    example: 'Instalações muito limpas e bem mantidas!',
    required: false,
  })
  @Expose()
  @Transform(({ value }) => value ?? null)
  @Type(() => String)
  text?: string;

  @ApiProperty({
    description: 'A pontuação média do comentário, baseada nas avaliações.',
    example: 4.5,
  })
  @Expose()
  @Type(() => Number)
  score!: number;

  @ApiProperty({
    description: 'As avaliações detalhadas do comentário.',
    type: () => CommentRateCommentResponseDto,
  })
  @Expose()
  @Type(() => CommentRateCommentResponseDto)
  rate?: CommentRateCommentResponseDto;

  @ApiProperty({
    description: 'A contagem de reações (likes/dislikes) do comentário.',
    type: () => ReactCommentResponseDto,
  })
  @Expose()
  @Transform(({ obj }) => ({
    likes: obj.likes ?? 0,
    dislikes: obj.dislikes ?? 0,
  }))
  @Type(() => ReactCommentResponseDto)
  reactCounts!: ReactCommentResponseDto;

  @ApiProperty({
    description: 'O número de respostas que o comentário possui.',
    example: 5,
  })
  @Expose()
  replyCount!: number;

  @ApiProperty({
    description: 'O utilizador que criou o comentário.',
    type: () => UserCommentResponseDto,
  })
  @Expose()
  @Type(() => UserCommentResponseDto)
  user!: UserCommentResponseDto;

  @ApiProperty({
    description:
      'A reação do utilizador autenticado ao comentário (like/dislike).',
    example: 'like',
    enum: ReactType,
    nullable: true,
    required: false,
  })
  @Expose()
  myReact?: ReactType | null;

  @ApiProperty({
    description: 'A data de criação do comentário.',
    example: '2025-11-14T10:30:00Z',
    format: 'date-time',
  })
  @Expose()
  @Type(() => Date)
  createdAt!: Date;
}
