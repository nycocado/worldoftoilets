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
 * Contém a lógica de negócio para rejeitar uma denúncia de utilizador.
 */
@Injectable()
export class RejectReportUserUseCase {
  constructor(
    private readonly repository: ReportUserRepository,
    private readonly userService: UserService,
  ) {}

  /**
   * Rejeita uma denúncia de utilizador.
   *
   * @param {string} reportPublicId O ID público da denúncia.
   * @param {string} reviewerPublicId O ID público do revisor.
   * @returns {Promise<ReportUserResponseDto>} A denúncia atualizada.
   * @throws {NotFoundException} Se a denúncia não for encontrada.
   * @throws {BadRequestException} Se a denúncia não estiver pendente.
   */
  @Transactional()
  async execute(
    reportPublicId: string,
    reviewerPublicId: string,
  ): Promise<ReportUserResponseDto> {
    const report = await this.repository.findByPublicId(reportPublicId);

    if (!report) {
      throw new NotFoundException(REPORT_USER_EXCEPTIONS.REPORT_NOT_FOUND);
    }

    if (report.status !== ReportUserStatus.PENDING) {
      throw new BadRequestException(REPORT_USER_EXCEPTIONS.NOT_PENDING);
    }

    const reviewer = await this.userService.getUserByPublicId(reviewerPublicId);

    await this.repository.reject(report, reviewer);

    return plainToInstance(ReportUserResponseDto, report, {
      excludeExtraneousValues: true,
    });
  }
}
