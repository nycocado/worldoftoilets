import { ReplyRepository } from '@modules/reply/reply.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { REPLY_EXCEPTIONS } from '@modules/reply/constants/exceptions.constant';
import { ReplyResponseDto } from '@modules/reply/dto';
import { plainToInstance } from 'class-transformer';

/**
 * Contém a lógica de negócio para restaurar uma resposta que sofreu soft delete.
 */
@Injectable()
export class UndeleteReplyUseCase {
  constructor(private readonly repository: ReplyRepository) {}

  /**
   * Restaura uma resposta que sofreu soft delete.
   *
   * @param {string} publicId O ID público da resposta a ser restaurada.
   * @returns {Promise<ReplyResponseDto>} O DTO da resposta restaurada.
   * @throws {NotFoundException} Se a resposta não for encontrada.
   */
  @Transactional()
  async execute(publicId: string): Promise<ReplyResponseDto> {
    const reply = await this.repository.findByPublicId(publicId);

    if (!reply) {
      throw new NotFoundException(REPLY_EXCEPTIONS.REPLY_NOT_FOUND);
    }

    await this.repository.undelete(reply);

    return plainToInstance(ReplyResponseDto, reply, {
      excludeExtraneousValues: true,
    });
  }
}
