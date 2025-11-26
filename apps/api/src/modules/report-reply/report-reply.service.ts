import { Injectable, NotFoundException } from '@nestjs/common';
import { ReportReplyRepository } from './report-reply.repository';
import { ReportReplyEntity } from '@database/entities';
import { REPORT_REPLY_EXCEPTIONS } from './constants';

/**
 * Contém a lógica de negócio para as operações de denúncias de respostas.
 */
@Injectable()
export class ReportReplyService {
  constructor(private readonly repository: ReportReplyRepository) {}

  /**
   * Busca uma denúncia de resposta pelo seu ID público.
   *
   * @param {string} publicId O ID público da denúncia.
   * @returns {Promise<ReportReplyEntity>} A entidade da denúncia encontrada.
   * @throws {NotFoundException} Se a denúncia não for encontrada.
   */
  async getReportReplyByPublicId(publicId: string): Promise<ReportReplyEntity> {
    const report = await this.repository.findByPublicId(publicId);
    if (!report) {
      throw new NotFoundException(REPORT_REPLY_EXCEPTIONS.REPORT_NOT_FOUND);
    }
    return report;
  }
}
