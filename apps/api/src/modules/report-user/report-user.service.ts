import { Injectable, NotFoundException } from '@nestjs/common';
import { ReportUserRepository } from './report-user.repository';
import { ReportUserEntity } from '@database/entities';
import { REPORT_USER_EXCEPTIONS } from './constants';

/**
 * Contém a lógica de negócio para as operações de denúncias de utilizadores.
 */
@Injectable()
export class ReportUserService {
  constructor(private readonly repository: ReportUserRepository) {}

  /**
   * Busca uma denúncia de utilizador pelo seu ID público.
   *
   * @param {string} publicId O ID público da denúncia.
   * @returns {Promise<ReportUserEntity>} A entidade da denúncia encontrada.
   * @throws {NotFoundException} Se a denúncia não for encontrada.
   */
  async getReportUserByPublicId(publicId: string): Promise<ReportUserEntity> {
    const report = await this.repository.findByPublicId(publicId);
    if (!report) {
      throw new NotFoundException(REPORT_USER_EXCEPTIONS.REPORT_NOT_FOUND);
    }
    return report;
  }
}
