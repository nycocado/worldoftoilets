import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { ReportCommentRepository } from '../report-comment.repository';
import { UserService } from '@modules/user';
import { ReportCommentResponseDto } from '../dto';
import { plainToInstance } from 'class-transformer';
import { ReportCommentStatus } from '@database/entities';
import { REPORT_COMMENT_EXCEPTIONS } from '../constants';

/**
 * Contém a lógica de negócio para rejeitar uma denúncia de comentário.
 */
@Injectable()
export class RejectReportCommentUseCase {
  constructor(
    private readonly repository: ReportCommentRepository,
    private readonly userService: UserService,
  ) {}

  /**
   * Rejeita uma denúncia de comentário.
   *
   * @param {string} reportPublicId O ID público da denúncia.
   * @param {string} reviewerPublicId O ID público do revisor.
   * @returns {Promise<ReportCommentResponseDto>} A denúncia rejeitada.
   * @throws {NotFoundException} Se a denúncia não for encontrada.
   * @throws {BadRequestException} Se a denúncia não estiver pendente.
   */
  @Transactional()
  async execute(
    reportPublicId: string,
    reviewerPublicId: string,
  ): Promise<ReportCommentResponseDto> {
    const reviewer = await this.userService.getUserByPublicId(reviewerPublicId);
    const report = await this.repository.findByPublicId(reportPublicId);

    if (!report) {
      throw new NotFoundException(REPORT_COMMENT_EXCEPTIONS.REPORT_NOT_FOUND);
    }

    if (report.status !== ReportCommentStatus.PENDING) {
      throw new BadRequestException(
        REPORT_COMMENT_EXCEPTIONS.REPORT_NOT_PENDING,
      );
    }

    await this.repository.reject(report, reviewer);

    return plainToInstance(ReportCommentResponseDto, report, {
      excludeExtraneousValues: true,
    });
  }
}
