import { Injectable } from '@nestjs/common';
import { ReportToiletRepository } from '@modules/report-toilet';
import { ReportToiletDetailResponseDto } from '../dto';
import { plainToInstance } from 'class-transformer';
import { ToiletService } from '@modules/toilet';

/**
 * Contém a lógica de negócio para obter detalhes de denúncias de uma casa de banho.
 */
@Injectable()
export class GetReportToiletDetailsUseCase {
  constructor(
    private readonly repository: ReportToiletRepository,
    private readonly toiletService: ToiletService,
  ) {}

  /**
   * Obtém todos os detalhes de denúncias de uma casa de banho.
   *
   * @param {string} toiletPublicId O ID público da casa de banho.
   * @returns {Promise<ReportToiletDetailResponseDto>} Detalhes das denúncias.
   */
  async execute(
    toiletPublicId: string,
  ): Promise<ReportToiletDetailResponseDto> {
    const toilet = await this.toiletService.getToiletByPublicId(toiletPublicId);
    const reports =
      await this.repository.findAllByToiletPublicId(toiletPublicId);

    const reportsByType: Record<string, number> = {};
    reports.forEach((report) => {
      const type = report.typeReportToilet.apiName;
      reportsByType[type] = (reportsByType[type] || 0) + 1;
    });

    return plainToInstance(
      ReportToiletDetailResponseDto,
      {
        toilet,
        totalReports: reports.length,
        reports,
        reportsByType,
      },
      { excludeExtraneousValues: true },
    );
  }
}
