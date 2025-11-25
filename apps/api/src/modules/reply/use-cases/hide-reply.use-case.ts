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
import { ReplyState } from '@database/entities';

/**
 * Contém a lógica de negócio para ocultar uma resposta.
 */
@Injectable()
export class HideReplyUseCase {
  constructor(private readonly repository: ReplyRepository) {}

  /**
   * Oculta uma resposta, alterando seu estado para 'HIDDEN'.
   *
   * @param {string} publicId O ID público da resposta.
   * @returns {Promise<ReplyResponseDto>} O DTO da resposta atualizada.
   * @throws {NotFoundException} Se a resposta não for encontrada.
   * @throws {ConflictException} Se a resposta já foi deletada.
   */
  @Transactional()
  async execute(publicId: string): Promise<ReplyResponseDto> {
    const reply = await this.repository.findByPublicId(publicId);

    if (!reply) {
      throw new NotFoundException(REPLY_EXCEPTIONS.REPLY_NOT_FOUND);
    }

    if (reply.deletedAt) {
      throw new ConflictException(REPLY_EXCEPTIONS.REPLY_DELETED);
    }

    await this.repository.changeState(reply, ReplyState.HIDDEN);

    return plainToInstance(ReplyResponseDto, reply, {
      excludeExtraneousValues: true,
    });
  }
}
