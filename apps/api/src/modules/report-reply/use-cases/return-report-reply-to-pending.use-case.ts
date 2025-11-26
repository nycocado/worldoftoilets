import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { ReportReplyRepository } from '../report-reply.repository';
import { ReplyService } from '@modules/reply';
import { ReportReplyResponseDto } from '../dto';
import { plainToInstance } from 'class-transformer';
import { ReportReplyStatus } from '@database/entities';
import { REPORT_REPLY_EXCEPTIONS } from '../constants';

/**
 * Contém a lógica de negócio para retornar uma denúncia ao status pendente.
 */
@Injectable()
export class ReturnReportReplyToPendingUseCase {
  constructor(
    private readonly repository: ReportReplyRepository,
    private readonly replyService: ReplyService,
  ) {}

  /**
   * Retorna uma denúncia de resposta ao status pendente.
   * Se a denúncia estava ACCEPTED e não há outras denúncias ACCEPTED,
   * também restaura a resposta (undelete).
   *
   * @param {string} reportPublicId O ID público da denúncia.
   * @returns {Promise<ReportReplyResponseDto>} A denúncia atualizada.
   * @throws {NotFoundException} Se a denúncia não for encontrada.
   * @throws {BadRequestException} Se a denúncia já estiver pendente ou se há outras denúncias aceites.
   */
  @Transactional()
  async execute(reportPublicId: string): Promise<ReportReplyResponseDto> {
    const report = await this.repository.findByPublicId(reportPublicId);

    if (!report) {
      throw new NotFoundException(REPORT_REPLY_EXCEPTIONS.REPORT_NOT_FOUND);
    }

    if (report.status === ReportReplyStatus.PENDING) {
      throw new BadRequestException(REPORT_REPLY_EXCEPTIONS.ALREADY_PENDING);
    }

    const reply = report.reply;

    // Se a denúncia estava ACCEPTED, verificar se existem outras denúncias ACCEPTED
    if (report.status === ReportReplyStatus.ACCEPTED) {
      const hasOtherAccepted = await this.repository.hasOtherAcceptedReports(
        reply.id,
        report.id,
      );

      if (hasOtherAccepted) {
        throw new BadRequestException(
          REPORT_REPLY_EXCEPTIONS.CANNOT_RETURN_PENDING_WITH_OTHER_ACCEPTED,
        );
      }

      // Não há outras denúncias ACCEPTED, fazer undelete da resposta
      await this.replyService.undeleteReply(reply);
    }

    await this.repository.returnToPending(report);

    return plainToInstance(ReportReplyResponseDto, report, {
      excludeExtraneousValues: true,
    });
  }
}
