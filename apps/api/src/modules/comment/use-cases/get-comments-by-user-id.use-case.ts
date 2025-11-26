import { CommentRepository } from '@modules/comment/comment.repository';
import { Injectable } from '@nestjs/common';
import { CommentState } from '@database/entities';
import { UserService } from '@modules/user';
import { CommentResponseDto } from '@modules/comment/dto';
import { plainToInstance } from 'class-transformer';

/**
 * Contém a lógica de negócio para a busca de comentários de um utilizador específico.
 */
@Injectable()
export class GetCommentsByUserIdUseCase {
  constructor(
    private readonly repository: CommentRepository,
    private readonly userService: UserService,
  ) {}

  /**
   * Busca comentários de um utilizador com opções de paginação e filtro.
   *
   * @param {string} publicId O ID público do utilizador.
   * @param {boolean} [pageable] Define se a paginação deve ser aplicada.
   * @param {number} [page] O número da página.
   * @param {number} [size] O tamanho da página.
   * @param {CommentState} [commentState] O estado do comentário para filtrar.
   * @param {Date} [timestamp] O timestamp máximo de criação.
   * @param {string} [requestUserPublicId] O ID público do utilizador que faz a requisição.
   * @returns {Promise<CommentResponseDto[]>} Uma lista de DTOs de comentário.
   * @throws {NotFoundException} Se o utilizador não for encontrado.
   */
  async execute(
    publicId: string,
    pageable?: boolean,
    page?: number,
    size?: number,
    commentState?: CommentState,
    timestamp?: Date,
    requestUserPublicId?: string,
  ): Promise<CommentResponseDto[]> {
    const user = await this.userService.getUserByPublicId(publicId);
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
