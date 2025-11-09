import { CommentRepository } from '@modules/comment/comment.repository';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommentRateService } from '@modules/comment-rate';
import { Transactional } from '@mikro-orm/mariadb';
import { COMMENT_EXCEPTIONS } from '@modules/comment/constants/exceptions.constant';
import { UserService } from '@modules/user';
import { plainToInstance } from 'class-transformer';
import { CommentResponseDto } from '@modules/comment/dto';

@Injectable()
export class UpdateCommentUseCase {
  constructor(
    private readonly repository: CommentRepository,
    private readonly commentRateService: CommentRateService,
    private readonly userService: UserService,
  ) {}

  @Transactional()
  async execute(
    commentPublicId: string,
    userId: number,
    text?: string,
    clean?: number,
    paper?: boolean,
    structure?: number,
    accessibility?: number,
  ): Promise<CommentResponseDto> {
    const user = await this.userService.getUserById(userId);
    const comment = await this.repository.findByPublicId(commentPublicId);

    if (!comment || !comment.rate) {
      throw new NotFoundException(COMMENT_EXCEPTIONS.COMMENT_NOT_FOUND);
    }

    if (comment.user.id !== user.id) {
      throw new UnauthorizedException(COMMENT_EXCEPTIONS.COMMENT_NOT_OWNED);
    }

    await this.repository.update(comment, text);

    await this.commentRateService.updateCommentRate(
      comment.rate,
      clean,
      paper,
      structure,
      accessibility,
    );

    const dto = plainToInstance(CommentResponseDto, comment, {
      excludeExtraneousValues: true,
    });
    dto.reacts.dislikes = 0;
    dto.reacts.likes = 0;

    return dto;
  }
}
