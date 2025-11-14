import { ReactService } from '@modules/react';
import { UserService } from '@modules/user';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ReactDiscriminator } from '@database/entities';
import { CommentResponseDto } from '@modules/comment/dto';
import { CommentRepository } from '@modules/comment/comment.repository';
import { COMMENT_EXCEPTIONS } from '@modules/comment/constants/exceptions.constant';
import { plainToInstance } from 'class-transformer';
import { EnrichCommentsUseCase } from '@modules/comment/use-cases/enrich-comments.use-case';

@Injectable()
export class PutReactUseCase {
  constructor(
    private readonly repository: CommentRepository,
    private readonly userService: UserService,
    private readonly reactService: ReactService,
    private readonly enrichCommentsWithReactsUseCase: EnrichCommentsUseCase,
  ) {}

  async execute(
    userId: number,
    commentPublicId: string,
    discriminator: ReactDiscriminator,
  ): Promise<CommentResponseDto> {
    const user = await this.userService.getUserById(userId);
    const comment = await this.repository.findByPublicId(commentPublicId);

    if (!comment) {
      throw new NotFoundException(COMMENT_EXCEPTIONS.COMMENT_NOT_FOUND);
    }

    const react = await this.reactService.getReactByUserAndComment(
      user,
      comment,
    );

    if (!react) {
      await this.reactService.createReact(user, comment, discriminator);
    }

    if (react && react.discriminator === discriminator) {
      await this.reactService.deleteReact(react);
    }

    if (react && react.discriminator !== discriminator) {
      await this.reactService.updateReact(react, discriminator);
    }

    const dto = await this.enrichCommentsWithReactsUseCase.execute([comment]);

    return dto[0];
  }
}
