import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CommentEntity } from '@database/entities/comment.entity';
import { CommentResponseDto } from '@modules/comment/dto/comment-response.dto';
import { ReactService } from '@modules/react/react.service';
import { CommentRepository } from '@modules/comment';

@Injectable()
export class EnrichCommentsUseCase {
  constructor(
    private readonly repository: CommentRepository,
    private readonly reactService: ReactService,
  ) {}

  async execute(comments: CommentEntity[]): Promise<CommentResponseDto[]> {
    const reacts = await this.reactService.getReactCountsForComments(comments);

    const dto = plainToInstance(CommentResponseDto, comments, {
      excludeExtraneousValues: true,
    });

    dto.forEach((commentDto) => {
      const reactData = reacts.get(commentDto.publicId);
      commentDto.reacts.dislikes = reactData?.dislikes ?? 0;
      commentDto.reacts.likes = reactData?.likes ?? 0;
    });

    const usersPublicIds = [...new Set(comments.map((c) => c.user.publicId))];

    const commentCountsByUsers =
      await this.repository.findCommentsCountsByUserPublicIds(usersPublicIds);

    dto.forEach((comment) => {
      const commentCountForUser = commentCountsByUsers.get(
        comment.user.publicId,
      );
      comment.user.commentsCount = commentCountForUser ?? 0;
    });

    return dto;
  }
}
