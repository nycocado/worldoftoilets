import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { ReportToiletRepository } from '@modules/report-toilet';
import { UserService } from '@modules/user';
import { ReportToiletResponseDto } from '../dto';
import { plainToInstance } from 'class-transformer';
import { ReportToiletStatus } from '@database/entities';
import { REPORT_TOILET_EXCEPTIONS } from '../constants';
import { ToiletService } from '@modules/toilet';

/**
 * Contém a lógica de negócio para aceitar uma denúncia de casa de banho.
 */
@Injectable()
export class AcceptReportToiletUseCase {
  constructor(
    private readonly repository: ReportToiletRepository,
    private readonly userService: UserService,
    private readonly toiletService: ToiletService,
  ) {}

  /**
   * Aceita uma denúncia de casa de banho e aplica a resolução (soft delete do toilet).
   *
   * @param {string} reportPublicId O ID público da denúncia.
   * @param {string} reviewerPublicId O ID público do revisor.
   * @returns {Promise<ReportToiletResponseDto>} A denúncia aceite.
   * @throws {NotFoundException} Se a denúncia não for encontrada.
   * @throws {BadRequestException} Se a denúncia não estiver pendente.
   */
  @Transactional()
  async execute(
    reportPublicId: string,
    reviewerPublicId: string,
  ): Promise<ReportToiletResponseDto> {
    const reviewer = await this.userService.getUserByPublicId(reviewerPublicId);
    const report = await this.repository.findByPublicId(reportPublicId);

    if (!report) {
      throw new NotFoundException(REPORT_TOILET_EXCEPTIONS.REPORT_NOT_FOUND);
    }

    if (report.status !== ReportToiletStatus.PENDING) {
      throw new BadRequestException(
        REPORT_TOILET_EXCEPTIONS.REPORT_NOT_PENDING,
      );
    }

    await this.repository.accept(report, reviewer);

    const toilet = report.interaction.toilet;
    await this.toiletService.softDeleteToilet(toilet, reviewer);

    return plainToInstance(ReportToiletResponseDto, report, {
      excludeExtraneousValues: true,
    });
  }
}
