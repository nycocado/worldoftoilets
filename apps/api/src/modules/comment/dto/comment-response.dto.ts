import { Expose, Transform, Type } from 'class-transformer';
import { CommentRateResponseDto } from '@modules/comment/dto/comment-rate-response.dto';
import { UserResponseDto } from '@modules/comment/dto';
import { ReactResponseDto } from '@modules/comment/dto/react-response.dto';

export class CommentResponseDto {
  @Expose()
  publicId!: string;

  @Expose()
  @Transform(({ value }) => value ?? null)
  text?: string;

  @Expose()
  score!: number;

  @Expose()
  @Type(() => CommentRateResponseDto)
  rate?: CommentRateResponseDto;

  @Expose()
  @Type(() => ReactResponseDto)
  reacts!: ReactResponseDto;

  @Expose()
  @Type(() => UserResponseDto)
  user!: UserResponseDto;

  @Expose()
  createdAt!: Date;
}
