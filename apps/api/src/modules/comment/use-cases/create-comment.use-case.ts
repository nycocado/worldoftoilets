import { Injectable } from '@nestjs/common';
import { UserService } from '@modules/user';
import { ToiletService } from '@modules/toilet/toilet.service';
import { CommentRateService } from '@modules/comment-rate/comment-rate.service';
import { InteractionService } from '@modules/interaction';
import { Transactional } from '@mikro-orm/mariadb';
import { InteractionDiscriminator } from '@database/entities';
import { CommentRepository } from '@modules/comment/comment.repository';
import { plainToInstance } from 'class-transformer';
import { CommentResponseDto } from '@modules/comment/dto';

@Injectable()
export class CreateCommentUseCase {
  constructor(
    private readonly repository: CommentRepository,
    private readonly userService: UserService,
    private readonly toiletService: ToiletService,
    private readonly interactionService: InteractionService,
    private readonly commentRateService: CommentRateService,
  ) {}

  @Transactional()
  async execute(
    userId: number,
    toiletPublicId: string,
    clean: number,
    paper: boolean,
    structure: number,
    accessibility: number,
    text?: string,
  ): Promise<CommentResponseDto> {
    const user = await this.userService.getUserById(userId);
    const toilet = await this.toiletService.getToiletByPublicId(toiletPublicId);
    const interaction = await this.interactionService.createInteraction(
      user,
      toilet,
      InteractionDiscriminator.COMMENT,
    );
    const comment = await this.repository.create(interaction, text);
    await this.commentRateService.createCommentRate(
      comment,
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
