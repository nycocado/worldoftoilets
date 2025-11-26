import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { ReportCommentRepository } from '../report-comment.repository';
import { UserService } from '@modules/user';
import { CommentService } from '@modules/comment';
import { ReportCommentResponseDto } from '../dto';
import { plainToInstance } from 'class-transformer';
import { ReportCommentStatus } from '@database/entities';
import { REPORT_COMMENT_EXCEPTIONS } from '../constants';

/**
 * Contém a lógica de negócio para aceitar uma denúncia de comentário.
 */
@Injectable()
export class AcceptReportCommentUseCase {
  constructor(
    private readonly repository: ReportCommentRepository,
    private readonly userService: UserService,
    private readonly commentService: CommentService,
  ) {}

  /**
   * Aceita uma denúncia de comentário e aplica a resolução (soft delete do comment).
   *
   * @param {string} reportPublicId O ID público da denúncia.
   * @param {string} reviewerPublicId O ID público do revisor.
   * @returns {Promise<ReportCommentResponseDto>} A denúncia aceite.
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

    await this.repository.accept(report, reviewer);

    const comment = report.react.comment;
    await this.commentService.softDeleteComment(comment, reviewer);

    return plainToInstance(ReportCommentResponseDto, report, {
      excludeExtraneousValues: true,
    });
  }
}
