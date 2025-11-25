import { Injectable } from '@nestjs/common';
import { CommentRepository } from '@modules/comment';
import { UserService } from '@modules/user';
import { CommentState } from '@database/entities';
import { CommentResponseDto } from '@modules/comment/dto';
import { plainToInstance } from 'class-transformer';

/**
 * Contém a lógica de negócio para a busca de comentários de um utilizador específico por seu ID público.
 */
@Injectable()
export class GetCommentsByUserPublicIdUseCase {
  constructor(
    private readonly repository: CommentRepository,
    private readonly userService: UserService,
  ) {}

  /**
   * Busca comentários de um utilizador com opções de paginação e filtro.
   *
   * @param {string} userPublicId O ID público do utilizador.
   * @param {boolean} [pageable] Define se a paginação deve ser aplicada.
   * @param {number} [page] O número da página.
   * @param {number} [size] O tamanho da página.
   * @param {CommentState} [commentState] O estado do comentário para filtrar.
   * @param {Date} [timestamp] O timestamp máximo de criação.
   * @param {string} [requestUserPublicId] O ID público do utilizador autenticado que está fazendo a consulta, para filtrar comentários denunciados por ele.
   * @returns {Promise<CommentResponseDto[]>} Uma lista de DTOs de comentário.
   * @throws {NotFoundException} Se o utilizador não for encontrado.
   */
  async execute(
    userPublicId: string,
    pageable?: boolean,
    page?: number,
    size?: number,
    commentState?: CommentState,
    timestamp?: Date,
    requestUserPublicId?: string,
  ): Promise<CommentResponseDto[]> {
    const user = await this.userService.getUserByPublicId(userPublicId);
    const requestUser = requestUserPublicId
      ? await this.userService.getUserByPublicId(requestUserPublicId)
      : undefined;

    const result = await this.repository.findByUser(
      user,
      pageable,
      page,
      size,
      commentState,
      timestamp,
      requestUser,
    );
    return plainToInstance(CommentResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }
}
