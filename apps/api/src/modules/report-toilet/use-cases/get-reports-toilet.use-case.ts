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
    page: number,
    limit: number,
    status?: ReportToiletStatus,
  ): Promise<ReportToiletListResponseDto[]> {
    const offset = page * limit;

    const grouped = await this.repository.findGroupedByToilet(
      status,
      true,
      offset,
      limit,
    );

    return grouped.map((item) =>
      plainToInstance(
        ReportToiletListResponseDto,
        { ...item, status: item.status },
        { excludeExtraneousValues: true },
      ),
    );
  }
}
