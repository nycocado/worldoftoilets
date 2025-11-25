import { ReplyRepository } from '@modules/reply/reply.repository';
import { Injectable } from '@nestjs/common';
import { ReplyState } from '@database/entities';
import { CommentService } from '@modules/comment';
import { ReplyResponseDto } from '@modules/reply/dto';
import { plainToInstance } from 'class-transformer';

/**
 * Contém a lógica de negócio para a busca de respostas de um comentário.
 */
@Injectable()
export class GetRepliesByCommentUseCase {
  constructor(
    private readonly repository: ReplyRepository,
    private readonly commentService: CommentService,
  ) {}

  /**
   * Busca respostas de um comentário com opções de paginação e filtro.
   *
   * @param {string} commentPublicId O ID público do comentário.
   * @param {boolean} [pageable] Define se a paginação deve ser aplicada.
   * @param {number} [page] O número da página.
   * @param {number} [size] O tamanho da página.
   * @param {ReplyState} [replyState] O estado da resposta para filtrar.
   * @param {Date} [timestamp] O timestamp máximo de criação.
   * @returns {Promise<ReplyResponseDto[]>} Uma lista de DTOs de resposta.
   * @throws {NotFoundException} Se o comentário não for encontrado.
   */
  async execute(
    commentPublicId: string,
    pageable?: boolean,
    page?: number,
    size?: number,
    replyState?: ReplyState,
    timestamp?: Date,
  ): Promise<ReplyResponseDto[]> {
    const comment =
      await this.commentService.getCommentByPublicId(commentPublicId);
    const result = await this.repository.findByComment(
      comment,
      pageable,
      page,
      size,
      replyState,
      timestamp,
    );
    return plainToInstance(ReplyResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }
}
