import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { textTimeToMilliseconds } from '@common/utils/jwt-time.util';
import { ConfigService } from '@nestjs/config';
import { ReplyRepository } from '@modules/reply/reply.repository';

/**
 * Serviço de Respostas
 *
 * @class ReplyService
 * @description Serviço de alto nível para gestão de respostas.
 * Oferece limpeza automática de respostas expiradas através de cron jobs.
 *
 * @implements
 *   - Remoção automática de respostas com soft delete expirado
 *
 * @see ReplyRepository - Repositório para acesso aos dados
 */
@Injectable()
export class ReplyService {
  /**
   * Construtor do ReplyService
   *
   * @param {ConfigService} configService - Serviço de configuração para ler variáveis de ambiente
   * @param {ReplyRepository} replyRepository - Repositório para operações de respostas
   */
  constructor(
    private readonly configService: ConfigService,
    private readonly replyRepository: ReplyRepository,
  ) {}

  /**
   * Deletar respostas expiradas (Cron Job)
   *
   * @async
   * @cron Executado diariamente à meia-noite
   * @returns {Promise<void>}
   *
   * @description
   * Cron job que remove permanentemente respostas com soft delete expirado.
   * Lê a configuração REPLY_SOFT_DELETE_RETENTION para determinar o período de retenção.
   * Respostas marcadas como deletadas há mais tempo que o período de retenção são removidas.
   * Executado automaticamente todos os dias à meia-noite.
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
