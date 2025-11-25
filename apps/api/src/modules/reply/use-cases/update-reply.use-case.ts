import { ReplyRepository } from '@modules/reply/reply.repository';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { REPLY_EXCEPTIONS } from '@modules/reply/constants/exceptions.constant';
import { UserService } from '@modules/user';
import { ReplyResponseDto } from '@modules/reply/dto';
import { plainToInstance } from 'class-transformer';

/**
 * Contém a lógica de negócio para a atualização de uma resposta pelo seu autor.
 */
@Injectable()
export class UpdateReplyUseCase {
  constructor(
    private readonly repository: ReplyRepository,
    private readonly userService: UserService,
  ) {}

  /**
   * Atualiza os dados de uma resposta.
   *
   * @param {string} replyPublicId O ID público da resposta.
   * @param {string} userPublicId O ID público do autor da resposta.
   * @param {string} [text] O novo texto da resposta.
   * @returns {Promise<ReplyResponseDto>} O DTO da resposta atualizada.
   * @throws {NotFoundException} Se a resposta não for encontrada.
   * @throws {ConflictException} Se a resposta já foi deletada.
   * @throws {UnauthorizedException} Se o utilizador não for o autor da resposta.
   */
  @Transactional()
  async execute(
    replyPublicId: string,
    userPublicId: string,
    text?: string,
  ): Promise<ReplyResponseDto> {
    const user = await this.userService.getUserByPublicId(userPublicId);
    const reply = await this.repository.findByPublicId(replyPublicId);

    if (!reply) {
      throw new NotFoundException(REPLY_EXCEPTIONS.REPLY_NOT_FOUND);
    }

    if (reply.deletedAt) {
      throw new ConflictException(REPLY_EXCEPTIONS.REPLY_DELETED);
    }

    if (reply.user.publicId !== user.publicId) {
      throw new UnauthorizedException(REPLY_EXCEPTIONS.REPLY_NOT_OWNED);
    }

    await this.repository.update(reply, text);

    return plainToInstance(ReplyResponseDto, reply, {
      excludeExtraneousValues: true,
    });
  }
}
