import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  CommentEntity,
  ReactEntity,
  ReportCommentEntity,
  ReportCommentStatus,
  TypeReportCommentEntity,
  UserEntity,
} from '@database/entities';
import {
  EntityRepository,
  QueryOrder,
  Transactional,
} from '@mikro-orm/mariadb';

/**
 * Gerencia o acesso e a persistência de dados para a entidade ReportComment.
 */
@Injectable()
export class ReportCommentRepository {
  constructor(
    @InjectRepository(ReportCommentEntity)
    private readonly repository: EntityRepository<ReportCommentEntity>,
  ) {}

  /**
   * Busca uma denúncia de comentário pelo seu ID público.
   *
   * @param {string} publicId O ID público da denúncia.
   * @returns {Promise<ReportCommentEntity | null>} A denúncia ou null.
   */
  async findByPublicId(publicId: string): Promise<ReportCommentEntity | null> {
    return this.repository.findOne(
      { publicId },
      {
        populate: [
          'typeReportComment',
          'react.user.credential',
          'react.user.commentsCount',
          'react.user.partner',
          'react.comment.interaction.toilet.access',
          'react.comment.interaction.toilet.extras',
          'react.comment.interaction.toilet.totalRatings',
          'react.comment.interaction.toilet.avgClean',
          'react.comment.interaction.toilet.avgStructure',
          'react.comment.interaction.toilet.avgAccessibility',
          'react.comment.interaction.toilet.paperAvailability',
          'react.comment.interaction.user.credential',
          'react.comment.interaction.user.commentsCount',
          'react.comment.interaction.user.partner',
          'react.comment.rate',
          'react.comment.likes',
          'react.comment.dislikes',
          'react.comment.replyCount',
          'reviewedBy.credential',
          'reviewedBy.commentsCount',
          'reviewedBy.partner',
        ],
      },
    );
  }

  /**
   * Busca comentários agrupados por denúncias com agregações usando QueryBuilder.
   * Lógica de filtro:
   * - PENDING: comments que NÃO têm NENHUMA denúncia ACCEPTED
   * - ACCEPTED: comments que TÊM pelo menos uma denúncia ACCEPTED
   * - REJECTED: comments que TÊM denúncias REJECTED e nenhuma ACCEPTED
   *
   * @param {ReportCommentStatus} [status] Filtro por status da denúncia.
   * @param {boolean} [pageable] Ativa a paginação.
   * @param {number} [page] Número da página.
   * @param {number} [size] Tamanho da página.
   * @returns {Promise<Array>} Lista de comentários com agregações de denúncias.
   */
  async findGroupedByComment(
    status?: ReportCommentStatus,
    pageable?: boolean,
    page?: number,
    size?: number,
  ): Promise<
    Array<{
      comment: CommentEntity;
      totalReports: number;
      mostFrequentType: string;
      latestReportDate: Date;
      status: ReportCommentStatus;
    }>
  > {
    const em = this.repository.getEntityManager();
    const knex = em.getKnex();

    // Subconsulta para tipo mais frequente
    const mostFrequentTypeSubquery = knex
      .select('trc.api_name')
      .from('report_comment as rc2')
      .join('react as r2', 'rc2.react_id', 'r2.id')
      .join(
        'type_report_comment as trc',
        'rc2.type_report_comment_id',
        'trc.id',
      )
      .whereRaw('r2.comment_id = ??', ['c.id'])
      .groupBy('trc.api_name')
      .orderByRaw('COUNT(*) DESC')
      .limit(1);

    let query = knex
      .select([
        'c.id as comment_id',
        knex.raw('COUNT(rc.id) as total_reports'),
        knex.raw('(?) as most_frequent_type', [mostFrequentTypeSubquery]),
        knex.raw('MAX(rc.created_at) as latest_report_date'),
        knex.raw(
          `(CASE
              WHEN EXISTS (SELECT 1 FROM report_comment rc_s JOIN react r_s ON rc_s.react_id = r_s.id WHERE r_s.comment_id = c.id AND rc_s.status = ?) THEN ?
              WHEN EXISTS (SELECT 1 FROM report_comment rc_s JOIN react r_s ON rc_s.react_id = r_s.id WHERE r_s.comment_id = c.id AND rc_s.status = ?) THEN ?
              ELSE ?
            END) as status`,
          [
            ReportCommentStatus.REJECTED,
            ReportCommentStatus.REJECTED,
            ReportCommentStatus.ACCEPTED,
            ReportCommentStatus.ACCEPTED,
            ReportCommentStatus.PENDING,
          ],
        ),
      ])
      .from('report_comment as rc')
      .join('react as r', 'rc.react_id', 'r.id')
      .join('comment as c', 'r.comment_id', 'c.id')
      .groupBy('c.id');

    // Aplicar filtro de status
    if (status) {
      query = query.having(
        knex.raw(
          `(CASE
              WHEN EXISTS (SELECT 1 FROM report_comment rc_s JOIN react r_s ON rc_s.react_id = r_s.id WHERE r_s.comment_id = c.id AND rc_s.status = ?) THEN ?
              WHEN EXISTS (SELECT 1 FROM report_comment rc_s JOIN react r_s ON rc_s.react_id = r_s.id WHERE r_s.comment_id = c.id AND rc_s.status = ?) THEN ?
              ELSE ?
            END) = ?`,
          [
            ReportCommentStatus.REJECTED,
            ReportCommentStatus.REJECTED,
            ReportCommentStatus.ACCEPTED,
            ReportCommentStatus.ACCEPTED,
            ReportCommentStatus.PENDING,
            status,
          ],
        ),
      );
    }

    query = query.orderBy('latest_report_date', 'desc');

    // Aplicar paginação
    if (pageable && page !== undefined && size !== undefined) {
      query = query.limit(size).offset(page);
    }

    const results = await query;

    // Buscar as entidades completas dos comments
    const commentIds = results.map((r: any) => r.comment_id);
    if (commentIds.length === 0) {
      return [];
    }

    const comments = await em.find(
      CommentEntity,
      { id: { $in: commentIds } },
      {
        populate: [
          'interaction.toilet.access',
          'interaction.toilet.extras',
          'interaction.toilet.totalRatings',
          'interaction.toilet.avgClean',
          'interaction.toilet.avgStructure',
          'interaction.toilet.avgAccessibility',
          'interaction.toilet.paperAvailability',
          'interaction.user.credential',
          'interaction.user.commentsCount',
          'interaction.user.partner',
          'rate',
          'likes',
          'dislikes',
          'replyCount',
        ],
      },
    );

    const commentMap = new Map(comments.map((c) => [c.id, c]));

    return results.map((r: any) => ({
      comment: commentMap.get(r.comment_id)!,
      totalReports: Number(r.total_reports),
      mostFrequentType: r.most_frequent_type,
      latestReportDate: new Date(r.latest_report_date),
      status: r.status,
    }));
  }

  /**
   * Busca todas as denúncias de um comentário específico.
   *
   * @param {string} commentPublicId O ID público do comentário.
   * @returns {Promise<ReportCommentEntity[]>} Lista de denúncias.
   */
  async findAllByCommentPublicId(
    commentPublicId: string,
  ): Promise<ReportCommentEntity[]> {
    return this.repository.find(
      {
        react: {
          comment: { publicId: commentPublicId },
        },
      },
      {
        populate: [
          'typeReportComment',
          'react.user.credential',
          'react.user.commentsCount',
          'react.user.partner',
          'react.comment.interaction.toilet.access',
          'react.comment.interaction.toilet.extras',
          'react.comment.interaction.toilet.totalRatings',
          'react.comment.interaction.toilet.avgClean',
          'react.comment.interaction.toilet.avgStructure',
          'react.comment.interaction.toilet.avgAccessibility',
          'react.comment.interaction.toilet.paperAvailability',
          'react.comment.interaction.user.credential',
          'react.comment.interaction.user.commentsCount',
          'react.comment.interaction.user.partner',
          'react.comment.rate',
          'react.comment.likes',
          'react.comment.dislikes',
          'react.comment.replyCount',
          'reviewedBy.credential',
          'reviewedBy.commentsCount',
          'reviewedBy.partner',
        ],
        orderBy: { createdAt: QueryOrder.DESC },
      },
    );
  }

  /**
   * Cria uma nova denúncia de comentário.
   *
   * @param {ReactEntity} react A reação de denúncia.
   * @param {TypeReportCommentEntity} typeReportComment O tipo de denúncia.
   * @returns {Promise<ReportCommentEntity>} A denúncia criada.
   */
  @Transactional()
  async create(
    react: ReactEntity,
    typeReportComment: TypeReportCommentEntity,
  ): Promise<ReportCommentEntity> {
    const em = this.repository.getEntityManager();

    const report = new ReportCommentEntity();
    report.react = react;
    report.typeReportComment = typeReportComment;
    report.status = ReportCommentStatus.PENDING;

    await em.persistAndFlush(report);
    return report;
  }

  /**
   * Aceita uma denúncia.
   *
   * @param {ReportCommentEntity} report A denúncia.
   * @param {UserEntity} reviewedBy O revisor.
   * @returns {Promise<ReportCommentEntity>} A denúncia atualizada.
   */
  @Transactional()
  async accept(
    report: ReportCommentEntity,
    reviewedBy: UserEntity,
  ): Promise<ReportCommentEntity> {
    const em = this.repository.getEntityManager();
    report.status = ReportCommentStatus.ACCEPTED;
    report.reviewedBy = reviewedBy;
    report.reviewedAt = new Date();
    await em.flush();
    return report;
  }

  /**
   * Rejeita uma denúncia.
   *
   * @param {ReportCommentEntity} report A denúncia.
   * @param {UserEntity} reviewedBy O revisor.
   * @returns {Promise<ReportCommentEntity>} A denúncia atualizada.
   */
  @Transactional()
  async reject(
    report: ReportCommentEntity,
    reviewedBy: UserEntity,
  ): Promise<ReportCommentEntity> {
    const em = this.repository.getEntityManager();
    report.status = ReportCommentStatus.REJECTED;
    report.reviewedBy = reviewedBy;
    report.reviewedAt = new Date();
    await em.flush();
    return report;
  }

  /**
   * Retorna uma denúncia ao status pendente.
   *
   * @param {ReportCommentEntity} report A denúncia.
   * @returns {Promise<ReportCommentEntity>} A denúncia atualizada.
   */
  @Transactional()
  async returnToPending(
    report: ReportCommentEntity,
  ): Promise<ReportCommentEntity> {
    const em = this.repository.getEntityManager();
    report.status = ReportCommentStatus.PENDING;
    report.reviewedBy = undefined;
    report.reviewedAt = undefined;
    await em.flush();
    return report;
  }

  /**
   * Verifica se existem outras denúncias aceites para o mesmo comentário.
   *
   * @param {number} commentId O ID interno do comentário.
   * @param {number} excludeReportId O ID da denúncia a excluir da verificação.
   * @returns {Promise<boolean>} True se existem outras denúncias aceites.
   */
  async hasOtherAcceptedReports(
    commentId: number,
    excludeReportId: number,
  ): Promise<boolean> {
    const count = await this.repository.count({
      id: { $ne: excludeReportId },
      react: { comment: { id: commentId } },
      status: ReportCommentStatus.ACCEPTED,
    });
    return count > 0;
  }
}
