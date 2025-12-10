import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  ReportUserEntity,
  ReportUserStatus,
  TypeReportUserEntity,
  UserEntity,
} from '@database/entities';
import {
  EntityRepository,
  QueryOrder,
  Transactional,
} from '@mikro-orm/mariadb';

/**
 * Gerencia o acesso e a persistência de dados para a entidade ReportUser.
 */
@Injectable()
export class ReportUserRepository {
  constructor(
    @InjectRepository(ReportUserEntity)
    private readonly repository: EntityRepository<ReportUserEntity>,
  ) {}

  /**
   * Busca uma denúncia de utilizador pelo seu ID público.
   *
   * @param {string} publicId O ID público da denúncia.
   * @returns {Promise<ReportUserEntity | null>} A denúncia ou null.
   */
  async findByPublicId(publicId: string): Promise<ReportUserEntity | null> {
    return this.repository.findOne(
      { publicId },
      {
        populate: [
          'typeReportUser',
          'userReporter.credential',
          'userReporter.commentsCount',
          'userReporter.partner',
          'userReported.credential',
          'userReported.commentsCount',
          'userReported.partner',
          'reviewedBy.credential',
          'reviewedBy.commentsCount',
          'reviewedBy.partner',
        ],
      },
    );
  }

  /**
   * Busca utilizadores agrupados por denúncias com agregações usando QueryBuilder.
   * Lógica de filtro:
   * - PENDING: users que NÃO têm NENHUMA denúncia ACCEPTED
   * - ACCEPTED: users que TÊM pelo menos uma denúncia ACCEPTED
   * - REJECTED: users que TÊM denúncias REJECTED e nenhuma ACCEPTED
   *
   * @param {ReportUserStatus} [status] Filtro por status da denúncia.
   * @param {boolean} [pageable] Ativa a paginação.
   * @param {number} [page] Número da página.
   * @param {number} [size] Tamanho da página.
   * @returns {Promise<Array>} Lista de utilizadores com agregações de denúncias.
   */
  async findGroupedByUser(
    status?: ReportUserStatus,
    pageable?: boolean,
    page?: number,
    size?: number,
  ): Promise<
    Array<{
      userReported: UserEntity;
      totalReports: number;
      mostFrequentType: string;
      latestReportDate: Date;
      status: ReportUserStatus;
    }>
  > {
    const em = this.repository.getEntityManager();
    const knex = em.getKnex();

    // Subconsulta para tipo mais frequente
    const mostFrequentTypeSubquery = knex
      .select('tru.api_name')
      .from('report_user as ru2')
      .join('type_report_user as tru', 'ru2.type_report_user_id', 'tru.id')
      .whereRaw('ru2.user_reported_id = ??', ['u.id'])
      .groupBy('tru.api_name')
      .orderByRaw('COUNT(*) DESC')
      .limit(1);

    let query = knex
      .select([
        'u.id as user_id',
        knex.raw('COUNT(ru.id) as total_reports'),
        knex.raw('(?) as most_frequent_type', [mostFrequentTypeSubquery]),
        knex.raw('MAX(ru.created_at) as latest_report_date'),
        knex.raw(
          `(CASE
              WHEN EXISTS (SELECT 1 FROM report_user ru_s WHERE ru_s.user_reported_id = u.id AND ru_s.status = ?) THEN ?
              WHEN EXISTS (SELECT 1 FROM report_user ru_s WHERE ru_s.user_reported_id = u.id AND ru_s.status = ?) THEN ?
              ELSE ?
            END) as status`,
          [
            ReportUserStatus.REJECTED,
            ReportUserStatus.REJECTED,
            ReportUserStatus.ACCEPTED,
            ReportUserStatus.ACCEPTED,
            ReportUserStatus.PENDING,
          ],
        ),
      ])
      .from('report_user as ru')
      .join('user as u', 'ru.user_reported_id', 'u.id')
      .groupBy('u.id');

    // Aplicar filtro de status
    if (status) {
      query = query.having(
        knex.raw(
          `(CASE
              WHEN EXISTS (SELECT 1 FROM report_user ru_s WHERE ru_s.user_reported_id = u.id AND ru_s.status = ?) THEN ?
              WHEN EXISTS (SELECT 1 FROM report_user ru_s WHERE ru_s.user_reported_id = u.id AND ru_s.status = ?) THEN ?
              ELSE ?
            END) = ?`,
          [
            ReportUserStatus.REJECTED,
            ReportUserStatus.REJECTED,
            ReportUserStatus.ACCEPTED,
            ReportUserStatus.ACCEPTED,
            ReportUserStatus.PENDING,
            status,
          ],
        ),
      );
    }

    // Aplicar paginação
    if (pageable && page !== undefined && size !== undefined) {
      query = query.limit(size).offset(page * size);
    }

    const results = await query;

    // Buscar as entidades completas dos users
    const userIds = results.map((r: any) => r.user_id);
    if (userIds.length === 0) {
      return [];
    }

    const users = await em.find(
      UserEntity,
      { id: { $in: userIds } },
      {
        populate: ['credential', 'commentsCount', 'partner'],
      },
    );

    const userMap = new Map(users.map((u) => [u.id, u]));

    return results.map((r: any) => ({
      userReported: userMap.get(r.user_id)!,
      totalReports: Number(r.total_reports),
      mostFrequentType: r.most_frequent_type,
      latestReportDate: new Date(r.latest_report_date),
      status: r.status,
    }));
  }

  /**
   * Busca todas as denúncias de um utilizador específico.
   *
   * @param {string} userPublicId O ID público do utilizador.
   * @returns {Promise<ReportUserEntity[]>} Lista de denúncias.
   */
  async findAllByUserPublicId(
    userPublicId: string,
  ): Promise<ReportUserEntity[]> {
    return this.repository.find(
      {
        userReported: { publicId: userPublicId },
      },
      {
        populate: [
          'typeReportUser',
          'userReporter.credential',
          'userReporter.commentsCount',
          'userReporter.partner',
          'userReported.credential',
          'userReported.commentsCount',
          'userReported.partner',
          'reviewedBy.credential',
          'reviewedBy.commentsCount',
          'reviewedBy.partner',
        ],
        orderBy: { createdAt: QueryOrder.DESC },
      },
    );
  }

  /**
   * Cria uma nova denúncia de utilizador.
   *
   * @param {UserEntity} userReporter O utilizador que fez a denúncia.
   * @param {UserEntity} userReported O utilizador denunciado.
   * @param {TypeReportUserEntity} typeReportUser O tipo de denúncia.
   * @returns {Promise<ReportUserEntity>} A denúncia criada.
   */
  @Transactional()
  async create(
    userReporter: UserEntity,
    userReported: UserEntity,
    typeReportUser: TypeReportUserEntity,
  ): Promise<ReportUserEntity> {
    const em = this.repository.getEntityManager();

    const report = new ReportUserEntity();
    report.userReporter = userReporter;
    report.userReported = userReported;
    report.typeReportUser = typeReportUser;
    report.status = ReportUserStatus.PENDING;

    await em.persistAndFlush(report);
    return report;
  }

  /**
   * Aceita uma denúncia.
   *
   * @param {ReportUserEntity} report A denúncia.
   * @param {UserEntity} reviewedBy O revisor.
   * @returns {Promise<ReportUserEntity>} A denúncia atualizada.
   */
  @Transactional()
  async accept(
    report: ReportUserEntity,
    reviewedBy: UserEntity,
  ): Promise<ReportUserEntity> {
    const em = this.repository.getEntityManager();
    report.status = ReportUserStatus.ACCEPTED;
    report.reviewedBy = reviewedBy;
    report.reviewedAt = new Date();
    await em.flush();
    return report;
  }

  /**
   * Rejeita uma denúncia.
   *
   * @param {ReportUserEntity} report A denúncia.
   * @param {UserEntity} reviewedBy O revisor.
   * @returns {Promise<ReportUserEntity>} A denúncia atualizada.
   */
  @Transactional()
  async reject(
    report: ReportUserEntity,
    reviewedBy: UserEntity,
  ): Promise<ReportUserEntity> {
    const em = this.repository.getEntityManager();
    report.status = ReportUserStatus.REJECTED;
    report.reviewedBy = reviewedBy;
    report.reviewedAt = new Date();
    await em.flush();
    return report;
  }

  /**
   * Retorna uma denúncia ao status pendente.
   *
   * @param {ReportUserEntity} report A denúncia.
   * @returns {Promise<ReportUserEntity>} A denúncia atualizada.
   */
  @Transactional()
  async returnToPending(report: ReportUserEntity): Promise<ReportUserEntity> {
    const em = this.repository.getEntityManager();
    report.status = ReportUserStatus.PENDING;
    report.reviewedBy = undefined;
    report.reviewedAt = undefined;
    await em.flush();
    return report;
  }

  /**
   * Verifica se existem outras denúncias aceites para o mesmo utilizador.
   *
   * @param {number} userId O ID interno do utilizador.
   * @param {number} excludeReportId O ID da denúncia a excluir da verificação.
   * @returns {Promise<boolean>} True se existem outras denúncias aceites.
   */
  async hasOtherAcceptedReports(
    userId: number,
    excludeReportId: number,
  ): Promise<boolean> {
    const count = await this.repository.count({
      id: { $ne: excludeReportId },
      userReported: { id: userId },
      status: ReportUserStatus.ACCEPTED,
    });
    return count > 0;
  }
}
