import { ReplyRepository } from '@modules/reply/reply.repository';
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { REPLY_EXCEPTIONS } from '@modules/reply/constants/exceptions.constant';
import { ReplyResponseDto } from '@modules/reply/dto';
import { plainToInstance } from 'class-transformer';

/**
 * Contém a lógica de negócio para a atualização de uma resposta para fins de moderação.
 */
@Injectable()
export class UpdateReplyManageUseCase {
  constructor(private readonly repository: ReplyRepository) {}

  /**
   * Atualiza os dados de uma resposta para fins de moderação.
   *
   * @param {string} replyPublicId O ID público da resposta.
   * @param {string} [text] O novo texto da resposta.
   * @returns {Promise<ReplyResponseDto>} O DTO da resposta atualizada.
   * @throws {NotFoundException} Se a resposta não for encontrada.
   * @throws {ConflictException} Se a resposta já foi deletada.
   */
  @Transactional()
  async execute(
    replyPublicId: string,
    text?: string,
  ): Promise<ReplyResponseDto> {
    const reply = await this.repository.findByPublicId(replyPublicId);

    if (!reply) {
      throw new NotFoundException(REPLY_EXCEPTIONS.REPLY_NOT_FOUND);
    }

    if (reply.deletedAt) {
      throw new ConflictException(REPLY_EXCEPTIONS.REPLY_DELETED);
    }

    await this.repository.update(reply, text);

    return plainToInstance(ReplyResponseDto, reply, {
      excludeExtraneousValues: true,
    });
  }
}
