import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  InteractionEntity,
  ReportToiletEntity,
  ReportToiletStatus,
  ToiletEntity,
  TypeReportToiletEntity,
  UserEntity,
} from '@database/entities';
import {
  EntityRepository,
  QueryOrder,
  Transactional,
} from '@mikro-orm/mariadb';

/**
 * Gerencia o acesso e a persistência de dados para a entidade ReportToilet.
 */
@Injectable()
export class ReportToiletRepository {
  constructor(
    @InjectRepository(ReportToiletEntity)
    private readonly repository: EntityRepository<ReportToiletEntity>,
  ) {}

  /**
   * Busca uma denúncia de casa de banho pelo seu ID público.
   *
   * @param {string} publicId O ID público da denúncia.
   * @returns {Promise<ReportToiletEntity | null>} A denúncia ou null.
   */
  async findByPublicId(publicId: string): Promise<ReportToiletEntity | null> {
    return this.repository.findOne(
      { publicId },
      {
        populate: [
          'typeReportToilet',
          'interaction.user.credential',
          'interaction.user.commentsCount',
          'interaction.user.partner',
          'interaction.toilet.access',
          'interaction.toilet.extras',
          'interaction.toilet.totalRatings',
          'interaction.toilet.avgClean',
          'interaction.toilet.avgStructure',
          'interaction.toilet.avgAccessibility',
          'interaction.toilet.paperAvailability',
          'reviewedBy.credential',
          'reviewedBy.commentsCount',
          'reviewedBy.partner',
        ],
      },
    );
  }

  /**
   * Busca casas de banho agrupadas por denúncias com agregações usando QueryBuilder.
   * Lógica de filtro:
   * - PENDING: toilets que NÃO têm NENHUMA denúncia ACCEPTED
   * - ACCEPTED: toilets que TÊM pelo menos uma denúncia ACCEPTED
   * - REJECTED: toilets que TÊM denúncias REJECTED e nenhuma ACCEPTED
   *
   * @param {ReportToiletStatus} [status] Filtro por status da denúncia.
   * @param {boolean} [pageable] Ativa a paginação.
   * @param {number} [page] Número da página.
   * @param {number} [size] Tamanho da página.
   * @returns {Promise<Array>} Lista de casas de banho com agregações de denúncias.
   */
  async findGroupedByToilet(
    status?: ReportToiletStatus,
    pageable?: boolean,
    page?: number,
    size?: number,
  ): Promise<
    Array<{
      toilet: ToiletEntity;
      totalReports: number;
      mostFrequentType: string;
      latestReportDate: Date;
      status: ReportToiletStatus;
    }>
  > {
    const em = this.repository.getEntityManager();
    const knex = em.getKnex();

    // Subconsulta para tipo mais frequente
    const mostFrequentTypeSubquery = knex
      .select('trt.api_name')
      .from('report_toilet as rt2')
      .join('interaction as i2', 'rt2.interaction_id', 'i2.id')
      .join('type_report_toilet as trt', 'rt2.type_report_toilet_id', 'trt.id')
      .whereRaw('i2.toilet_id = ??', ['t.id'])
      .groupBy('trt.api_name')
      .orderByRaw('COUNT(*) DESC')
      .limit(1);

    let query = knex
      .select([
        't.id as toilet_id',
        knex.raw('COUNT(rt.id) as total_reports'),
        knex.raw('(?) as most_frequent_type', [mostFrequentTypeSubquery]),
        knex.raw('MAX(rt.created_at) as latest_report_date'),
        knex.raw(
          `(CASE
              WHEN EXISTS (SELECT 1 FROM report_toilet rt_s JOIN interaction i_s ON rt_s.interaction_id = i_s.id WHERE i_s.toilet_id = t.id AND rt_s.status = ?) THEN ?
              WHEN EXISTS (SELECT 1 FROM report_toilet rt_s JOIN interaction i_s ON rt_s.interaction_id = i_s.id WHERE i_s.toilet_id = t.id AND rt_s.status = ?) THEN ?
              ELSE ?
            END) as status`,
          [
            ReportToiletStatus.REJECTED,
            ReportToiletStatus.REJECTED,
            ReportToiletStatus.ACCEPTED,
            ReportToiletStatus.ACCEPTED,
            ReportToiletStatus.PENDING,
          ],
        ),
      ])
      .from('report_toilet as rt')
      .join('interaction as i', 'rt.interaction_id', 'i.id')
      .join('toilet as t', 'i.toilet_id', 't.id')
      .groupBy('t.id');

    // Aplicar filtro de status
    if (status) {
      query = query.having(
        knex.raw(
          `(CASE
              WHEN EXISTS (SELECT 1 FROM report_toilet rt_s JOIN interaction i_s ON rt_s.interaction_id = i_s.id WHERE i_s.toilet_id = t.id AND rt_s.status = ?) THEN ?
              WHEN EXISTS (SELECT 1 FROM report_toilet rt_s JOIN interaction i_s ON rt_s.interaction_id = i_s.id WHERE i_s.toilet_id = t.id AND rt_s.status = ?) THEN ?
              ELSE ?
            END) = ?`,
          [
            ReportToiletStatus.REJECTED,
            ReportToiletStatus.REJECTED,
            ReportToiletStatus.ACCEPTED,
            ReportToiletStatus.ACCEPTED,
            ReportToiletStatus.PENDING,
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

    // Buscar as entidades completas dos toilets
    const toiletIds = results.map((r: any) => r.toilet_id);
    if (toiletIds.length === 0) {
      return [];
    }

    const toilets = await em.find(
      ToiletEntity,
      { id: { $in: toiletIds } },
      {
        populate: [
          'access',
          'extras',
          'totalRatings',
          'avgClean',
          'avgStructure',
          'avgAccessibility',
          'paperAvailability',
        ],
      },
    );

    const toiletMap = new Map(toilets.map((t) => [t.id, t]));

    return results.map((r: any) => ({
      toilet: toiletMap.get(r.toilet_id)!,
      totalReports: Number(r.total_reports),
      mostFrequentType: r.most_frequent_type,
      latestReportDate: new Date(r.latest_report_date),
      status: r.status,
    }));
  }

  /**
   * Busca todas as denúncias de uma casa de banho específica.
   *
   * @param {string} toiletPublicId O ID público da casa de banho.
   * @returns {Promise<ReportToiletEntity[]>} Lista de denúncias.
   */
  async findAllByToiletPublicId(
    toiletPublicId: string,
  ): Promise<ReportToiletEntity[]> {
    return this.repository.find(
      {
        interaction: {
          toilet: { publicId: toiletPublicId },
        },
      },
      {
        populate: [
          'typeReportToilet',
          'interaction.user.credential',
          'interaction.user.commentsCount',
          'interaction.user.partner',
          'interaction.toilet.access',
          'interaction.toilet.extras',
          'interaction.toilet.totalRatings',
          'interaction.toilet.avgClean',
          'interaction.toilet.avgStructure',
          'interaction.toilet.avgAccessibility',
          'interaction.toilet.paperAvailability',
          'reviewedBy.credential',
          'reviewedBy.commentsCount',
          'reviewedBy.partner',
        ],
        orderBy: { createdAt: QueryOrder.DESC },
      },
    );
  }

  /**
   * Cria uma nova denúncia de casa de banho.
   *
   * @param {InteractionEntity} interaction A interação de denúncia.
   * @param {TypeReportToiletEntity} typeReportToilet O tipo de denúncia.
   * @returns {Promise<ReportToiletEntity>} A denúncia criada.
   */
  @Transactional()
  async create(
    interaction: InteractionEntity,
    typeReportToilet: TypeReportToiletEntity,
  ): Promise<ReportToiletEntity> {
    const em = this.repository.getEntityManager();

    const report = new ReportToiletEntity();
    report.interaction = interaction;
    report.typeReportToilet = typeReportToilet;
    report.status = ReportToiletStatus.PENDING;

    await em.persistAndFlush(report);
    return report;
  }

  /**
   * Aceita uma denúncia.
   *
   * @param {ReportToiletEntity} report A denúncia.
   * @param {UserEntity} reviewedBy O revisor.
   * @returns {Promise<ReportToiletEntity>} A denúncia atualizada.
   */
  @Transactional()
  async accept(
    report: ReportToiletEntity,
    reviewedBy: UserEntity,
  ): Promise<ReportToiletEntity> {
    const em = this.repository.getEntityManager();
    report.status = ReportToiletStatus.ACCEPTED;
    report.reviewedBy = reviewedBy;
    report.reviewedAt = new Date();
    await em.flush();
    return report;
  }

  /**
   * Rejeita uma denúncia.
   *
   * @param {ReportToiletEntity} report A denúncia.
   * @param {UserEntity} reviewedBy O revisor.
   * @returns {Promise<ReportToiletEntity>} A denúncia atualizada.
   */
  @Transactional()
  async reject(
    report: ReportToiletEntity,
    reviewedBy: UserEntity,
  ): Promise<ReportToiletEntity> {
    const em = this.repository.getEntityManager();
    report.status = ReportToiletStatus.REJECTED;
    report.reviewedBy = reviewedBy;
    report.reviewedAt = new Date();
    await em.flush();
    return report;
  }

  /**
   * Retorna uma denúncia ao status pendente.
   *
   * @param {ReportToiletEntity} report A denúncia.
   * @returns {Promise<ReportToiletEntity>} A denúncia atualizada.
   */
  @Transactional()
  async returnToPending(
    report: ReportToiletEntity,
  ): Promise<ReportToiletEntity> {
    const em = this.repository.getEntityManager();
    report.status = ReportToiletStatus.PENDING;
    report.reviewedBy = undefined;
    report.reviewedAt = undefined;
    await em.flush();
    return report;
  }

  /**
   * Verifica se existem outras denúncias aceites para a mesma casa de banho.
   *
   * @param {number} toiletId O ID interno da casa de banho.
   * @param {number} excludeReportId O ID da denúncia a excluir da verificação.
   * @returns {Promise<boolean>} True se existem outras denúncias aceites.
   */
  async hasOtherAcceptedReports(
    toiletId: number,
    excludeReportId: number,
  ): Promise<boolean> {
    const count = await this.repository.count({
      id: { $ne: excludeReportId },
      interaction: { toilet: { id: toiletId } },
      status: ReportToiletStatus.ACCEPTED,
    });
    return count > 0;
  }
}
