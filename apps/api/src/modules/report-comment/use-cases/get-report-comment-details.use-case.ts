import { Injectable } from '@nestjs/common';
import { ReportCommentRepository } from '../report-comment.repository';
import { ReportCommentDetailResponseDto } from '../dto';
import { plainToInstance } from 'class-transformer';
import { CommentService } from '@modules/comment';

/**
 * Contém a lógica de negócio para obter detalhes de denúncias de um comentário.
 */
@Injectable()
export class GetReportCommentDetailsUseCase {
  constructor(
    private readonly repository: ReportCommentRepository,
    private readonly commentService: CommentService,
  ) {}

  /**
   * Obtém todos os detalhes de denúncias de um comentário.
   *
   * @param {string} commentPublicId O ID público do comentário.
   * @returns {Promise<ReportCommentDetailResponseDto>} Detalhes das denúncias.
   */
  async execute(
    commentPublicId: string,
  ): Promise<ReportCommentDetailResponseDto> {
    const comment =
      await this.commentService.getCommentByPublicId(commentPublicId);
    const reports =
      await this.repository.findAllByCommentPublicId(commentPublicId);

    const reportsByType: Record<string, number> = {};
    reports.forEach((report) => {
      const type = report.typeReportComment.apiName;
      reportsByType[type] = (reportsByType[type] || 0) + 1;
    });

    return plainToInstance(
      ReportCommentDetailResponseDto,
      {
        comment,
        totalReports: reports.length,
        reports,
        reportsByType,
      },
      { excludeExtraneousValues: true },
    );
  }
}
