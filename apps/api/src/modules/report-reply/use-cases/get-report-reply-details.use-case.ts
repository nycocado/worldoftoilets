import { Injectable, NotFoundException } from '@nestjs/common';
import { ReportReplyRepository } from '../report-reply.repository';
import { ReportReplyDetailResponseDto } from '../dto';
import { plainToInstance } from 'class-transformer';
import { ReplyService } from '@modules/reply';
import { REPORT_REPLY_EXCEPTIONS } from '../constants';

/**
 * Contém a lógica de negócio para obter detalhes de denúncias de uma resposta.
 */
@Injectable()
export class GetReportReplyDetailsUseCase {
  constructor(
    private readonly repository: ReportReplyRepository,
    private readonly replyService: ReplyService,
  ) {}

  /**
   * Obtém todas as denúncias de uma resposta específica.
   *
   * @param {string} replyPublicId O ID público da resposta.
   * @returns {Promise<ReportReplyDetailResponseDto>} Detalhes das denúncias.
   * @throws {NotFoundException} Se a resposta não for encontrada.
   */
  async execute(replyPublicId: string): Promise<ReportReplyDetailResponseDto> {
    const reply = await this.replyService.getReplyByPublicId(replyPublicId);

    const reports = await this.repository.findAllByReplyPublicId(replyPublicId);

    if (!reports || reports.length === 0) {
      throw new NotFoundException(REPORT_REPLY_EXCEPTIONS.REPLY_NOT_FOUND);
    }

    // Agrupar denúncias por tipo (contagem)
    const reportsByType: Record<string, number> = {};
    reports.forEach((report) => {
      const type = report.typeReportReply.apiName;
      reportsByType[type] = (reportsByType[type] || 0) + 1;
    });

    return plainToInstance(
      ReportReplyDetailResponseDto,
      {
        reply,
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
