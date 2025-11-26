import { Injectable } from '@nestjs/common';
import { ReportToiletRepository } from '@modules/report-toilet';
import { ReportToiletListResponseDto } from '../dto';
import { plainToInstance } from 'class-transformer';
import { ReportToiletStatus } from '@database/entities';

/**
 * Contém a lógica de negócio para listar casas de banho denunciadas.
 */
@Injectable()
export class GetReportsToiletUseCase {
  constructor(private readonly repository: ReportToiletRepository) {}

  /**
   * Lista casas de banho com denúncias e agregações.
   *
   * @param {ReportToiletStatus} [status] Filtro por status.
   * @param {boolean} [pageable] Ativar paginação.
   * @param {number} [page] Número da página.
   * @param {number} [size] Tamanho da página.
   * @returns {Promise<ReportToiletListResponseDto[]>} Lista de casas de banho denunciadas.
   */
  async execute(
    status?: ReportToiletStatus,
    pageable?: boolean,
    page?: number,
    size?: number,
  ): Promise<ReportToiletListResponseDto[]> {
    const grouped = await this.repository.findGroupedByToilet(
      status,
      pageable,
      page,
      size,
    );

    return grouped.map((item) =>
      plainToInstance(
        ReportToiletListResponseDto,
        {
          toilet: item.toilet,
          totalReports: item.totalReports,
          mostFrequentType: item.mostFrequentType,
          latestReportDate: item.latestReportDate,
        },
        { excludeExtraneousValues: true },
      ),
    );
  }
}
