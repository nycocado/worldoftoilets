import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  ReplyEntity,
  ReportReplyEntity,
  ReportReplyStatus,
  TypeReportReplyEntity,
  UserEntity,
} from '@database/entities';
import {
  EntityRepository,
  QueryOrder,
  Transactional,
} from '@mikro-orm/mariadb';

/**
 * Gerencia o acesso e a persistência de dados para a entidade ReportReply.
 */
@Injectable()
export class ReportReplyRepository {
  constructor(
    @InjectRepository(ReportReplyEntity)
    private readonly repository: EntityRepository<ReportReplyEntity>,
  ) {}

  /**
   * Busca uma denúncia de resposta pelo seu ID público.
   *
   * @param {string} publicId O ID público da denúncia.
   * @returns {Promise<ReportReplyEntity | null>} A denúncia ou null.
   */
  async findByPublicId(publicId: string): Promise<ReportReplyEntity | null> {
    return this.repository.findOne(
      { publicId },
      {
        populate: [
          'typeReportReply',
          'reply.user.credential',
          'reply.user.commentsCount',
          'reply.user.partner',
          'user.credential',
          'user.commentsCount',
          'user.partner',
          'reviewedBy.credential',
          'reviewedBy.commentsCount',
          'reviewedBy.partner',
        ],
      },
    );
  }

  /**
   * Busca respostas agrupadas por denúncias com agregações usando QueryBuilder.
   * Lógica de filtro:
   * - PENDING: replies que NÃO têm NENHUMA denúncia ACCEPTED
   * - ACCEPTED: replies que TÊM pelo menos uma denúncia ACCEPTED
   * - REJECTED: replies que TÊM denúncias REJECTED e nenhuma ACCEPTED
   *
   * @param {ReportReplyStatus} [status] Filtro por status da denúncia.
   * @param {boolean} [pageable] Ativa a paginação.
   * @param {number} [page] Número da página.
   * @param {number} [size] Tamanho da página.
   * @returns {Promise<Array>} Lista de respostas com agregações de denúncias.
   */
  async findGroupedByReply(
    status?: ReportReplyStatus,
    pageable?: boolean,
    page?: number,
    size?: number,
  ): Promise<
    Array<{
      reply: ReplyEntity;
      totalReports: number;
      mostFrequentType: string;
      latestReportDate: Date;
      status: ReportReplyStatus;
    }>
  > {
    const em = this.repository.getEntityManager();
    const knex = em.getKnex();

    // Subconsulta para tipo mais frequente
    const mostFrequentTypeSubquery = knex
      .select('trr.api_name')
      .from('report_reply as rr2')
      .join('type_report_reply as trr', 'rr2.type_report_reply_id', 'trr.id')
      .whereRaw('rr2.reply_id = ??', ['r.id'])
      .groupBy('trr.api_name')
      .orderByRaw('COUNT(*) DESC')
      .limit(1);

    let query = knex
      .select([
        'r.id as reply_id',
        knex.raw('COUNT(rr.id) as total_reports'),
        knex.raw('(?) as most_frequent_type', [mostFrequentTypeSubquery]),
        knex.raw('MAX(rr.created_at) as latest_report_date'),
        knex.raw(
          `(CASE
              WHEN EXISTS (SELECT 1 FROM report_reply rr_s WHERE rr_s.reply_id = r.id AND rr_s.status = ?) THEN ?
              WHEN EXISTS (SELECT 1 FROM report_reply rr_s WHERE rr_s.reply_id = r.id AND rr_s.status = ?) THEN ?
              ELSE ?
            END) as status`,
          [
            ReportReplyStatus.REJECTED,
            ReportReplyStatus.REJECTED,
            ReportReplyStatus.ACCEPTED,
            ReportReplyStatus.ACCEPTED,
            ReportReplyStatus.PENDING,
          ],
        ),
      ])
      .from('report_reply as rr')
      .join('reply as r', 'rr.reply_id', 'r.id')
      .groupBy('r.id');

    // Aplicar filtro de status
    if (status) {
      query = query.having(
        knex.raw(
          `(CASE
              WHEN EXISTS (SELECT 1 FROM report_reply rr_s WHERE rr_s.reply_id = r.id AND rr_s.status = ?) THEN ?
              WHEN EXISTS (SELECT 1 FROM report_reply rr_s WHERE rr_s.reply_id = r.id AND rr_s.status = ?) THEN ?
              ELSE ?
            END) = ?`,
          [
            ReportReplyStatus.REJECTED,
            ReportReplyStatus.REJECTED,
            ReportReplyStatus.ACCEPTED,
            ReportReplyStatus.ACCEPTED,
            ReportReplyStatus.PENDING,
            status,
          ],
        ),
      );
    }

    // Aplicar paginação
    if (pageable && page !== undefined && size !== undefined) {
      query = query.limit(size).offset(page);
    }

    const results = await query;

    // Buscar as entidades completas das replies
    const replyIds = results.map((r: any) => r.reply_id);
    if (replyIds.length === 0) {
      return [];
    }

    const replies = await em.find(
      ReplyEntity,
      { id: { $in: replyIds } },
      {
        populate: ['user.credential', 'user.commentsCount', 'user.partner'],
      },
    );

    const replyMap = new Map(replies.map((r) => [r.id, r]));

    return results.map((r: any) => ({
      reply: replyMap.get(r.reply_id)!,
      totalReports: Number(r.total_reports),
      mostFrequentType: r.most_frequent_type,
      latestReportDate: new Date(r.latest_report_date),
      status: r.status,
    }));
  }

  /**
   * Busca todas as denúncias de uma resposta específica.
   *
   * @param {string} replyPublicId O ID público da resposta.
   * @returns {Promise<ReportReplyEntity[]>} Lista de denúncias.
   */
  async findAllByReplyPublicId(
    replyPublicId: string,
  ): Promise<ReportReplyEntity[]> {
    return this.repository.find(
      {
        reply: { publicId: replyPublicId },
      },
      {
        populate: [
          'typeReportReply',
          'reply.user.credential',
          'reply.user.commentsCount',
          'reply.user.partner',
          'user.credential',
          'user.commentsCount',
          'user.partner',
          'reviewedBy.credential',
          'reviewedBy.commentsCount',
          'reviewedBy.partner',
        ],
        orderBy: { createdAt: QueryOrder.DESC },
      },
    );
  }

  /**
   * Cria uma nova denúncia de resposta.
   *
   * @param {UserEntity} user O utilizador que fez a denúncia.
   * @param {ReplyEntity} reply A resposta denunciada.
   * @param {TypeReportReplyEntity} typeReportReply O tipo de denúncia.
   * @returns {Promise<ReportReplyEntity>} A denúncia criada.
   */
  @Transactional()
  async create(
    user: UserEntity,
    reply: ReplyEntity,
    typeReportReply: TypeReportReplyEntity,
  ): Promise<ReportReplyEntity> {
    const em = this.repository.getEntityManager();

    const report = new ReportReplyEntity();
    report.user = user;
    report.reply = reply;
    report.typeReportReply = typeReportReply;
    report.status = ReportReplyStatus.PENDING;

    em.persist(report);
    await em.flush();
    return report;
  }

  /**
   * Aceita uma denúncia.
   *
   * @param {ReportReplyEntity} report A denúncia.
   * @param {UserEntity} reviewedBy O revisor.
   * @returns {Promise<ReportReplyEntity>} A denúncia atualizada.
   */
  @Transactional()
  async accept(
    report: ReportReplyEntity,
    reviewedBy: UserEntity,
  ): Promise<ReportReplyEntity> {
    const em = this.repository.getEntityManager();
    report.status = ReportReplyStatus.ACCEPTED;
    report.reviewedBy = reviewedBy;
    report.reviewedAt = new Date();
    await em.flush();
    return report;
  }

  /**
   * Rejeita uma denúncia.
   *
   * @param {ReportReplyEntity} report A denúncia.
   * @param {UserEntity} reviewedBy O revisor.
   * @returns {Promise<ReportReplyEntity>} A denúncia atualizada.
   */
  @Transactional()
  async reject(
    report: ReportReplyEntity,
    reviewedBy: UserEntity,
  ): Promise<ReportReplyEntity> {
    const em = this.repository.getEntityManager();
    report.status = ReportReplyStatus.REJECTED;
    report.reviewedBy = reviewedBy;
    report.reviewedAt = new Date();
    await em.flush();
    return report;
  }

  /**
   * Retorna uma denúncia ao status pendente.
   *
   * @param {ReportReplyEntity} report A denúncia.
   * @returns {Promise<ReportReplyEntity>} A denúncia atualizada.
   */
  @Transactional()
  async returnToPending(report: ReportReplyEntity): Promise<ReportReplyEntity> {
    const em = this.repository.getEntityManager();
    report.status = ReportReplyStatus.PENDING;
    report.reviewedBy = undefined;
    report.reviewedAt = undefined;
    await em.flush();
    return report;
  }

  /**
   * Verifica se existem outras denúncias aceites para a mesma resposta.
   *
   * @param {number} replyId O ID interno da resposta.
   * @param {number} excludeReportId O ID da denúncia a excluir da verificação.
   * @returns {Promise<boolean>} True se existem outras denúncias aceites.
   */
  async hasOtherAcceptedReports(
    replyId: number,
    excludeReportId: number,
  ): Promise<boolean> {
    const count = await this.repository.count({
      id: { $ne: excludeReportId },
      reply: { id: replyId },
      status: ReportReplyStatus.ACCEPTED,
    });
    return count > 0;
  }
}
