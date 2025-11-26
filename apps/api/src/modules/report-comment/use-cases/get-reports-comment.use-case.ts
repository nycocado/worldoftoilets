import { Injectable } from '@nestjs/common';
import { ReportCommentRepository } from '../report-comment.repository';
import { ReportCommentListResponseDto } from '../dto';
import { plainToInstance } from 'class-transformer';
import { ReportCommentStatus } from '@database/entities';

/**
 * Contém a lógica de negócio para listar comentários denunciados.
 */
@Injectable()
export class GetReportsCommentUseCase {
  constructor(private readonly repository: ReportCommentRepository) {}

  /**
   * Lista comentários denunciados com agregações.
   *
   * @param {ReportCommentStatus} [status] Filtro por status da denúncia.
   * @param {boolean} [pageable] Ativa a paginação.
   * @param {number} [page] Número da página.
   * @param {number} [size] Tamanho da página.
   * @returns {Promise<ReportCommentListResponseDto[]>} Lista de comentários denunciados.
   */
  async execute(
    status?: ReportCommentStatus,
    pageable?: boolean,
    page?: number,
    size?: number,
  ): Promise<ReportCommentListResponseDto[]> {
    const grouped = await this.repository.findGroupedByComment(
      status,
      pageable,
      page,
      size,
    );

    return plainToInstance(ReportCommentListResponseDto, grouped, {
      excludeExtraneousValues: true,
    });
  }
}
