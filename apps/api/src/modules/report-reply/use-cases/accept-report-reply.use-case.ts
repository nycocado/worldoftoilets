import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { ReportReplyRepository } from '../report-reply.repository';
import { UserService } from '@modules/user';
import { ReplyService } from '@modules/reply';
import { ReportReplyResponseDto } from '../dto';
import { plainToInstance } from 'class-transformer';
import { ReportReplyStatus } from '@database/entities';
import { REPORT_REPLY_EXCEPTIONS } from '../constants';

/**
 * Contém a lógica de negócio para aceitar uma denúncia de resposta.
 */
@Injectable()
export class AcceptReportReplyUseCase {
  constructor(
    private readonly repository: ReportReplyRepository,
    private readonly userService: UserService,
    private readonly replyService: ReplyService,
  ) {}

  /**
   * Aceita uma denúncia de resposta e aplica soft delete na resposta denunciada.
   *
   * @param {string} reportPublicId O ID público da denúncia.
   * @param {string} reviewerPublicId O ID público do revisor.
   * @returns {Promise<ReportReplyResponseDto>} A denúncia atualizada.
   * @throws {NotFoundException} Se a denúncia não for encontrada.
   * @throws {BadRequestException} Se a denúncia não estiver pendente.
   */
  @Transactional()
  async execute(
    reportPublicId: string,
    reviewerPublicId: string,
  ): Promise<ReportReplyResponseDto> {
    const report = await this.repository.findByPublicId(reportPublicId);

    if (!report) {
      throw new NotFoundException(REPORT_REPLY_EXCEPTIONS.REPORT_NOT_FOUND);
    }

    if (report.status !== ReportReplyStatus.PENDING) {
      throw new BadRequestException(REPORT_REPLY_EXCEPTIONS.NOT_PENDING);
    }

    const reviewer = await this.userService.getUserByPublicId(reviewerPublicId);
    const reply = report.reply;

    await this.repository.accept(report, reviewer);
    await this.replyService.softDeleteReply(reply, reviewer);

    return plainToInstance(ReportReplyResponseDto, report, {
      excludeExtraneousValues: true,
    });
  }
}
