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
   * Obter contagem de comentários de um utilizador
   *
   * @async
   * @param {UserEntity} user - Entidade de utilizador
   * @returns {Promise<number>} Número total de comentários visíveis do utilizador
   *
   * @description
   * Retorna a contagem de comentários visíveis (não deletados) de um utilizador específico.
   * Útil para exibir estatísticas de utilizador.
   */
  async getCommentsCountsForUser(user: UserEntity): Promise<number> {
    return this.commentRepository.findCommentsCountByUserPublicId(
      user.publicId,
    );
  }

  /**
   * Obter contagem de comentários para múltiplos utilizadores
   *
   * @async
   * @param {UserEntity[]} users - Array de entidades de utilizadores
   * @returns {Promise<Map<string, number>>} Mapa de publicId -> contagem de comentários
   *
   * @description
   * Operação em batch para obter contagens de comentários de múltiplos utilizadores.
   * Retorna um Map onde a chave é o publicId do utilizador e o valor é a contagem.
   * Otimizado para reduzir queries ao banco de dados quando múltiplas contagens são necessárias.
   */
  async getCommentsCountsForUsers(
    users: UserEntity[],
  ): Promise<Map<string, number>> {
    const userPublicIds = users.map((user) => user.publicId);
    return this.commentRepository.findCommentsCountsByUserPublicIds(
      userPublicIds,
    );
  }

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
