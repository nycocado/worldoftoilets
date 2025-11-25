import { Injectable, NotFoundException } from '@nestjs/common';
import { ReplyRepository } from '@modules/reply/reply.repository';
import { Transactional } from '@mikro-orm/mariadb';
import { REPLY_EXCEPTIONS } from '@modules/reply/constants/exceptions.constant';
import { UserService } from '@modules/user';

/**
 * Contém a lógica de negócio para o soft delete de uma resposta para fins de moderação.
 */
@Injectable()
export class DeleteReplyManageUseCase {
  constructor(
    private readonly repository: ReplyRepository,
    private readonly userService: UserService,
  ) {}

  /**
   * Realiza o soft delete de uma resposta para fins de moderação.
   *
   * @param {string} replyPublicId O ID público da resposta.
   * @param {string} moderatorPublicId O ID público do moderador que está a realizar a exclusão.
   * @returns {Promise<void>}
   * @throws {NotFoundException} Se a resposta não for encontrada.
   */
  @Transactional()
  async execute(
    replyPublicId: string,
    moderatorPublicId: string,
  ): Promise<void> {
    const moderator =
      await this.userService.getUserByPublicId(moderatorPublicId);
    const reply = await this.repository.findByPublicId(replyPublicId);

    if (!reply) {
      throw new NotFoundException(REPLY_EXCEPTIONS.REPLY_NOT_FOUND);
    }

    await this.repository.softDelete(reply, moderator);
  }
}
