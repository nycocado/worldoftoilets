import { Injectable, NotFoundException } from '@nestjs/common';
import { ReportUserRepository } from '../report-user.repository';
import { ReportUserDetailResponseDto } from '../dto';
import { plainToInstance } from 'class-transformer';
import { UserService } from '@modules/user';
import { REPORT_USER_EXCEPTIONS } from '../constants';

/**
 * Contém a lógica de negócio para obter detalhes de denúncias de um utilizador.
 */
@Injectable()
export class GetReportUserDetailsUseCase {
  constructor(
    private readonly repository: ReportUserRepository,
    private readonly userService: UserService,
  ) {}

  /**
   * Obtém todas as denúncias de um utilizador específico.
   *
   * @param {string} userPublicId O ID público do utilizador.
   * @returns {Promise<ReportUserDetailResponseDto>} Detalhes das denúncias.
   * @throws {NotFoundException} Se o utilizador não for encontrado.
   */
  async execute(userPublicId: string): Promise<ReportUserDetailResponseDto> {
    const userReported = await this.userService.getUserByPublicId(userPublicId);

    const reports = await this.repository.findAllByUserPublicId(userPublicId);

    if (!reports || reports.length === 0) {
      throw new NotFoundException(REPORT_USER_EXCEPTIONS.USER_NOT_FOUND);
    }

    // Agrupar denúncias por tipo (contagem)
    const reportsByType: Record<string, number> = {};
    reports.forEach((report) => {
      const type = report.typeReportUser.apiName;
      reportsByType[type] = (reportsByType[type] || 0) + 1;
    });

    return plainToInstance(
      ReportUserDetailResponseDto,
      {
        userReported,
        totalReports: reports.length,
        reportsByType,
        reports,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
