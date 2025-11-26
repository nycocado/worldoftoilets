import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { ReportCommentRepository } from '../report-comment.repository';
import { CommentService } from '@modules/comment';
import { ReportCommentResponseDto } from '../dto';
import { plainToInstance } from 'class-transformer';
import { ReportCommentStatus } from '@database/entities';
import { REPORT_COMMENT_EXCEPTIONS } from '../constants';

/**
 * Contém a lógica de negócio para retornar uma denúncia ao status pendente.
 */
@Injectable()
export class ReturnReportCommentToPendingUseCase {
  constructor(
    private readonly repository: ReportCommentRepository,
    private readonly commentService: CommentService,
  ) {}

  /**
   * Retorna uma denúncia ao status pendente.
   * Se a denúncia estava ACCEPTED e não há outras denúncias ACCEPTED,
   * também restaura o comentário (undelete).
   *
   * @param {string} reportPublicId O ID público da denúncia.
   * @returns {Promise<ReportCommentResponseDto>} A denúncia atualizada.
   * @throws {NotFoundException} Se a denúncia não for encontrada.
   * @throws {BadRequestException} Se a denúncia já estiver pendente ou se há outras denúncias aceites.
   */
  @Transactional()
  async execute(reportPublicId: string): Promise<ReportCommentResponseDto> {
    const report = await this.repository.findByPublicId(reportPublicId);

    if (!report) {
      throw new NotFoundException(REPORT_COMMENT_EXCEPTIONS.REPORT_NOT_FOUND);
    }

    if (report.status === ReportCommentStatus.PENDING) {
      throw new BadRequestException(
        REPORT_COMMENT_EXCEPTIONS.REPORT_ALREADY_PENDING,
      );
    }

    const comment = report.react.comment;

    // Se a denúncia estava ACCEPTED, verificar se existem outras denúncias ACCEPTED
    if (report.status === ReportCommentStatus.ACCEPTED) {
      const hasOtherAccepted = await this.repository.hasOtherAcceptedReports(
        comment.id,
        report.id,
      );

      if (hasOtherAccepted) {
        throw new BadRequestException(
          REPORT_COMMENT_EXCEPTIONS.CANNOT_RETURN_PENDING_WITH_OTHER_ACCEPTED,
        );
      }

      // Não há outras denúncias ACCEPTED, fazer undelete do comment
      await this.commentService.undeleteComment(comment);
    }

    await this.repository.returnToPending(report);

    return plainToInstance(ReportCommentResponseDto, report, {
      excludeExtraneousValues: true,
    });
  }
}
