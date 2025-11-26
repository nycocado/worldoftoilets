import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { textTimeToMilliseconds } from '@common/utils/jwt-time.util';
import { ConfigService } from '@nestjs/config';
import { ReplyRepository } from '@modules/reply/reply.repository';
import { ReplyEntity, UserEntity } from '@database/entities';
import { REPLY_EXCEPTIONS } from './constants';

/**
 * Contém a lógica de negócio para as operações de respostas.
 */
@Injectable()
export class ReplyService {
  constructor(
    private readonly configService: ConfigService,
    private readonly replyRepository: ReplyRepository,
  ) {}

  /**
   * Remove permanentemente as respostas que excederam o período de retenção do soft delete.
   * Este método é executado como um Cron Job diário.
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteExpiredReplies(): Promise<void> {
    const replyRetention = this.configService.getOrThrow<string>(
      'REPLY_SOFT_DELETE_RETENTION',
    );
    const retentionMs = textTimeToMilliseconds(replyRetention);
    const retention = new Date(Date.now() - retentionMs);
    return this.replyRepository.deleteExpired(retention);
  }

  /**
   * Busca uma resposta pelo seu ID público.
   *
   * @param {string} publicId O ID público da resposta.
   * @returns {Promise<ReplyEntity>} A resposta encontrada.
   * @throws {NotFoundException} Se a resposta não for encontrada.
   */
  async getReplyByPublicId(publicId: string): Promise<ReplyEntity> {
    const reply = await this.replyRepository.findByPublicId(publicId);
    if (!reply) {
      throw new NotFoundException(REPLY_EXCEPTIONS.REPLY_NOT_FOUND);
    }
    return reply;
  }

  /**
   * Faz soft delete de uma resposta.
   *
   * @param {ReplyEntity} reply A resposta a ser deletada.
   * @param {UserEntity} deletedBy O utilizador que deletou.
   * @returns {Promise<ReplyEntity>} A resposta atualizada.
   */
  async softDeleteReply(
    reply: ReplyEntity,
    deletedBy: UserEntity,
  ): Promise<ReplyEntity> {
    return this.replyRepository.softDelete(reply, deletedBy);
  }

  /**
   * Faz undelete de uma resposta.
   *
   * @param {ReplyEntity} reply A resposta a ser restaurada.
   * @returns {Promise<ReplyEntity>} A resposta restaurada.
   */
  async undeleteReply(reply: ReplyEntity): Promise<ReplyEntity> {
    return this.replyRepository.undelete(reply);
  }
}
