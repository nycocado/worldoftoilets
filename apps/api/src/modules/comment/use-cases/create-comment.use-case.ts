import { Injectable } from '@nestjs/common';
import { UserService } from '@modules/user';
import { ToiletService } from '@modules/toilet/toilet.service';
import { CommentRateService } from '@modules/comment-rate/comment-rate.service';
import { InteractionService } from '@modules/interaction';
import { Transactional } from '@mikro-orm/mariadb';
import { InteractionDiscriminator } from '@database/entities';
import { CommentRepository } from '@modules/comment/comment.repository';
import { CommentResponseDto } from '@modules/comment/dto';
import { plainToInstance } from 'class-transformer';

/**
 * Contém a lógica de negócio para a criação de um novo comentário.
 */
@Injectable()
export class CreateCommentUseCase {
  constructor(
    private readonly repository: CommentRepository,
    private readonly userService: UserService,
    private readonly toiletService: ToiletService,
    private readonly interactionService: InteractionService,
    private readonly commentRateService: CommentRateService,
  ) {}

  /**
   * Cria um novo comentário, incluindo a interação e a avaliação associada.
   *
   * @param {string} publicId O ID público do utilizador.
   * @param {string} toiletPublicId O ID público do sanitário.
   * @param {number} clean A avaliação de limpeza.
   * @param {boolean} paper A avaliação de disponibilidade de papel.
   * @param {number} structure A avaliação de estrutura.
   * @param {number} accessibility A avaliação de acessibilidade.
   * @param {string} [text] O texto do comentário.
   * @returns {Promise<CommentResponseDto>} O DTO do comentário criado.
   * @throws {NotFoundException} Se o utilizador ou o sanitário não forem encontrados.
   */
  @Transactional()
  async execute(
    publicId: string,
    toiletPublicId: string,
    clean: number,
    paper: boolean,
    structure: number,
    accessibility: number,
    text?: string,
  ): Promise<CommentResponseDto> {
    const user = await this.userService.getUserByPublicId(publicId);
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

    return plainToInstance(CommentResponseDto, comment, {
      excludeExtraneousValues: true,
    });
  }
}
