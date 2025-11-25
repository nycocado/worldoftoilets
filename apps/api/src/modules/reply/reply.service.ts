import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { textTimeToMilliseconds } from '@common/utils/jwt-time.util';
import { ConfigService } from '@nestjs/config';
import { ReplyRepository } from '@modules/reply/reply.repository';

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
}
