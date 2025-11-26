import { Injectable, NotFoundException } from '@nestjs/common';
import { ReportCommentRepository } from './report-comment.repository';
import { ReportCommentEntity } from '@database/entities';
import { REPORT_COMMENT_EXCEPTIONS } from './constants';

/**
 * Contém a lógica de negócio para as operações de denúncias de comentários.
 */
@Injectable()
export class ReportCommentService {
  constructor(private readonly repository: ReportCommentRepository) {}

  /**
   * Busca uma denúncia de comentário pelo seu ID público.
   *
   * @param {string} publicId O ID público da denúncia.
   * @returns {Promise<ReportCommentEntity>} A entidade da denúncia encontrada.
   * @throws {NotFoundException} Se a denúncia não for encontrada.
   */
  async getReportCommentByPublicId(
    publicId: string,
  ): Promise<ReportCommentEntity> {
    const report = await this.repository.findByPublicId(publicId);
    if (!report) {
      throw new NotFoundException(REPORT_COMMENT_EXCEPTIONS.REPORT_NOT_FOUND);
    }
    return report;
  }
}
