import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { ReportToiletRepository } from '@modules/report-toilet';
import { ToiletService } from '@modules/toilet';
import { ReportToiletResponseDto } from '../dto';
import { plainToInstance } from 'class-transformer';
import { ReportToiletStatus } from '@database/entities';
import { REPORT_TOILET_EXCEPTIONS } from '../constants';

/**
 * Contém a lógica de negócio para retornar uma denúncia ao status pendente.
 */
@Injectable()
export class ReturnReportToiletToPendingUseCase {
  constructor(
    private readonly repository: ReportToiletRepository,
    private readonly toiletService: ToiletService,
  ) {}

  /**
   * Retorna uma denúncia ao status pendente.
   * Se a denúncia estava ACCEPTED e não há outras denúncias ACCEPTED,
   * também restaura a casa de banho (undelete).
   *
   * @param {string} reportPublicId O ID público da denúncia.
   * @returns {Promise<ReportToiletResponseDto>} A denúncia atualizada.
   * @throws {NotFoundException} Se a denúncia não for encontrada.
   * @throws {BadRequestException} Se a denúncia já estiver pendente ou se há outras denúncias aceites.
   */
  @Transactional()
  async execute(reportPublicId: string): Promise<ReportToiletResponseDto> {
    const report = await this.repository.findByPublicId(reportPublicId);

    if (!report) {
      throw new NotFoundException(REPORT_TOILET_EXCEPTIONS.REPORT_NOT_FOUND);
    }

    if (report.status === ReportToiletStatus.PENDING) {
      throw new BadRequestException(
        REPORT_TOILET_EXCEPTIONS.REPORT_ALREADY_PENDING,
      );
    }

    const toilet = report.interaction.toilet;

    // Se a denúncia estava ACCEPTED, verificar se existem outras denúncias ACCEPTED
    if (report.status === ReportToiletStatus.ACCEPTED) {
      const hasOtherAccepted = await this.repository.hasOtherAcceptedReports(
        toilet.id,
        report.id,
      );

      if (hasOtherAccepted) {
        throw new BadRequestException(
          REPORT_TOILET_EXCEPTIONS.CANNOT_RETURN_PENDING_WITH_OTHER_ACCEPTED,
        );
      }

      // Não há outras denúncias ACCEPTED, fazer undelete do toilet
      await this.toiletService.undeleteToilet(toilet);
    }

    await this.repository.returnToPending(report);

    return plainToInstance(ReportToiletResponseDto, report, {
      excludeExtraneousValues: true,
    });
  }
}
