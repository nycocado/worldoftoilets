import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { textTimeToMilliseconds } from '@common/utils/jwt-time.util';
import { ConfigService } from '@nestjs/config';
import { CommentRepository } from '@modules/comment/comment.repository';
import { UserEntity } from '@database/entities';

/**
 * Serviço de Comentários
 *
 * @class CommentService
 * @description Serviço de alto nível para gestão de comentários.
 * Oferece operações de contagem de comentários por utilizador e
 * limpeza automática de comentários expirados através de cron jobs.
 *
 * @implements
 *   - Contagem de comentários por utilizador
 *   - Contagem em batch de comentários para múltiplos utilizadores
 *   - Remoção automática de comentários com soft delete expirado
 *
 * @see CommentRepository - Repositório para acesso aos dados
 */
@Injectable()
export class CommentService {
  /**
   * Construtor do CommentService
   *
   * @param {ConfigService} configService - Serviço de configuração para ler variáveis de ambiente
   * @param {CommentRepository} commentRepository - Repositório para operações de comentários
   */
  constructor(
    private readonly configService: ConfigService,
    private readonly commentRepository: CommentRepository,
  ) {}

  /**
   * Deletar comentários expirados (Cron Job)
   *
   * @async
   * @cron Executado diariamente à meia-noite
   * @returns {Promise<void>}
   *
   * @description
   * Cron job que remove permanentemente comentários com soft delete expirado.
   * Lê a configuração COMMENT_SOFT_DELETE_RETENTION para determinar o período de retenção.
   * Comentários marcados como deletados há mais tempo que o período de retenção são removidos.
   * Executado automaticamente todos os dias à meia-noite.
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteExpiredComments(): Promise<void> {
    const commentRetention = this.configService.getOrThrow<string>(
      'COMMENT_SOFT_DELETE_RETENTION',
    );
    const retentionMs = textTimeToMilliseconds(commentRetention);
    const retention = new Date(Date.now() - retentionMs);
    return this.commentRepository.deleteExpired(retention);
  }
}
