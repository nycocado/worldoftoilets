import { Injectable } from '@nestjs/common';
import { CommentRepository } from '@modules/comment/comment.repository';
import { ToiletService } from '@modules/toilet/toilet.service';
import { CommentState } from '@database/entities';
import { CommentResponseDto } from '@modules/comment/dto';
import { plainToInstance } from 'class-transformer';
import { UserService } from '@modules/user/user.service';

/**
 * Contém a lógica de negócio para a busca de comentários de um sanitário específico.
 */
@Injectable()
export class GetCommentsByToiletPublicIdUseCase {
  constructor(
    private readonly repository: CommentRepository,
    private readonly toiletService: ToiletService,
    private readonly userService: UserService,
  ) {}

  /**
   * Busca comentários de um sanitário com opções de paginação e filtro.
   *
   * @param {string} publicId O ID público do sanitário.
   * @param {boolean} [pageable] Define se a paginação deve ser aplicada.
   * @param {number} [page] O número da página.
   * @param {number} [size] O tamanho da página.
   * @param {CommentState} [commentState] O estado do comentário para filtrar.
   * @param {Date} [timestamp] O timestamp máximo de criação.
   * @param {string} [userPublicId] O ID público do utilizador autenticado, para filtrar comentários denunciados por ele.
   * @returns {Promise<CommentResponseDto[]>} Uma lista de DTOs de comentário.
   * @throws {NotFoundException} Se o sanitário não for encontrado.
   */
  async execute(
    publicId: string,
    pageable?: boolean,
    page?: number,
    size?: number,
    commentState?: CommentState,
    timestamp?: Date,
    userPublicId?: string,
  ): Promise<CommentResponseDto[]> {
    const toilet = await this.toiletService.getToiletByPublicId(publicId);
    const user = userPublicId
      ? await this.userService.getUserByPublicId(userPublicId)
      : undefined;

    const result = await this.repository.findByToilet(
      toilet,
      pageable,
      page,
      size,
      commentState,
      timestamp,
      user,
    );
    return plainToInstance(CommentResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }
}
