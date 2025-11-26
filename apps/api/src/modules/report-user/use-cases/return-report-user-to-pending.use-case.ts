import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { ReportUserRepository } from '../report-user.repository';
import { UserService } from '@modules/user';
import { ReportUserResponseDto } from '../dto';
import { plainToInstance } from 'class-transformer';
import { ReportUserStatus } from '@database/entities';
import { REPORT_USER_EXCEPTIONS } from '../constants';

/**
 * Contém a lógica de negócio para retornar uma denúncia ao status pendente.
 */
@Injectable()
export class ReturnReportUserToPendingUseCase {
  constructor(
    private readonly repository: ReportUserRepository,
    private readonly userService: UserService,
  ) {}

  /**
   * Retorna uma denúncia de utilizador ao status pendente.
   * Se a denúncia estava ACCEPTED e não há outras denúncias ACCEPTED,
   * também restaura o utilizador (undelete).
   *
   * @param {string} reportPublicId O ID público da denúncia.
   * @returns {Promise<ReportUserResponseDto>} A denúncia atualizada.
   * @throws {NotFoundException} Se a denúncia não for encontrada.
   * @throws {BadRequestException} Se a denúncia já estiver pendente ou se há outras denúncias aceites.
   */
  @Transactional()
  async execute(reportPublicId: string): Promise<ReportUserResponseDto> {
    const report = await this.repository.findByPublicId(reportPublicId);

    if (!report) {
      throw new NotFoundException(REPORT_USER_EXCEPTIONS.REPORT_NOT_FOUND);
    }

    if (report.status === ReportUserStatus.PENDING) {
      throw new BadRequestException(REPORT_USER_EXCEPTIONS.ALREADY_PENDING);
    }

    const user = report.userReported;

    // Se a denúncia estava ACCEPTED, verificar se existem outras denúncias ACCEPTED
    if (report.status === ReportUserStatus.ACCEPTED) {
      const hasOtherAccepted = await this.repository.hasOtherAcceptedReports(
        user.id,
        report.id,
      );

      if (hasOtherAccepted) {
        throw new BadRequestException(
          REPORT_USER_EXCEPTIONS.CANNOT_RETURN_PENDING_WITH_OTHER_ACCEPTED,
        );
      }

      // Não há outras denúncias ACCEPTED, fazer undelete do utilizador
      await this.userService.undeleteUser(user);
    }

    await this.repository.returnToPending(report);

    return plainToInstance(ReportUserResponseDto, report, {
      excludeExtraneousValues: true,
    });
  }
}
