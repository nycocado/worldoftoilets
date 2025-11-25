import { ReplyRepository } from '@modules/reply/reply.repository';
import { Injectable } from '@nestjs/common';
import { ReplyState } from '@database/entities';
import { UserService } from '@modules/user';
import { ReplyResponseDto } from '@modules/reply/dto';
import { plainToInstance } from 'class-transformer';

/**
 * Contém a lógica de negócio para a busca de respostas de um utilizador.
 */
@Injectable()
export class GetRepliesByUserUseCase {
  constructor(
    private readonly repository: ReplyRepository,
    private readonly userService: UserService,
  ) {}

  /**
   * Busca respostas de um utilizador com opções de paginação e filtro.
   *
   * @param {string} userPublicId O ID público do utilizador.
   * @param {boolean} [pageable] Define se a paginação deve ser aplicada.
   * @param {number} [page] O número da página.
   * @param {number} [size] O tamanho da página.
   * @param {ReplyState} [replyState] O estado da resposta para filtrar.
   * @param {Date} [timestamp] O timestamp máximo de criação.
   * @returns {Promise<ReplyResponseDto[]>} Uma lista de DTOs de resposta.
   * @throws {NotFoundException} Se o utilizador não for encontrado.
   */
  async execute(
    userPublicId: string,
    pageable?: boolean,
    page?: number,
    size?: number,
    replyState?: ReplyState,
    timestamp?: Date,
  ): Promise<ReplyResponseDto[]> {
    const user = await this.userService.getUserByPublicId(userPublicId);
    const result = await this.repository.findByUser(
      user,
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
