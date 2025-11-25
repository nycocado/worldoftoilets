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
 * Contém a lógica de negócio para tornar uma resposta visível.
 */
@Injectable()
export class ShowReplyUseCase {
  constructor(private readonly repository: ReplyRepository) {}

  /**
   * Torna uma resposta visível, alterando seu estado para 'VISIBLE'.
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

    await this.repository.changeState(reply, ReplyState.VISIBLE);

    return plainToInstance(ReplyResponseDto, reply, {
      excludeExtraneousValues: true,
    });
  }
}
