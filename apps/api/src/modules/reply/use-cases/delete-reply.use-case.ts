import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ReplyRepository } from '@modules/reply/reply.repository';
import { Transactional } from '@mikro-orm/mariadb';
import { REPLY_EXCEPTIONS } from '@modules/reply/constants/exceptions.constant';
import { UserService } from '@modules/user';

/**
 * Contém a lógica de negócio para o soft delete de uma resposta pelo seu autor.
 */
@Injectable()
export class DeleteReplyUseCase {
  constructor(
    private readonly repository: ReplyRepository,
    private readonly userService: UserService,
  ) {}

  /**
   * Realiza o soft delete de uma resposta, verificando a autoria.
   *
   * @param {string} replyPublicId O ID público da resposta.
   * @param {string} userPublicId O ID público do autor da resposta.
   * @returns {Promise<void>}
   * @throws {NotFoundException} Se a resposta não for encontrada.
   * @throws {UnauthorizedException} Se o utilizador não for o autor da resposta.
   */
  @Transactional()
  async execute(replyPublicId: string, userPublicId: string): Promise<void> {
    const user = await this.userService.getUserByPublicId(userPublicId);
    const reply = await this.repository.findByPublicId(replyPublicId);

    if (!reply) {
      throw new NotFoundException(REPLY_EXCEPTIONS.REPLY_NOT_FOUND);
    }

    if (reply.user.publicId !== user.publicId) {
      throw new UnauthorizedException(REPLY_EXCEPTIONS.REPLY_NOT_OWNED);
    }

    await this.repository.softDelete(reply, user);
  }
}
