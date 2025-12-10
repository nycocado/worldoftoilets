import { Injectable } from '@nestjs/common';
import { ReportReplyRepository } from '../report-reply.repository';
import { ReportReplyListResponseDto } from '../dto';
import { plainToInstance } from 'class-transformer';
import { ReportReplyStatus } from '@database/entities';

/**
 * Contém a lógica de negócio para listar respostas denunciadas.
 */
@Injectable()
export class GetReportsReplyUseCase {
  constructor(private readonly repository: ReportReplyRepository) {}

  /**
   * Lista respostas denunciadas com agregações.
   *
   * @param {number} page Número da página.
   * @param {number} limit Itens por página.
   * @param {ReportReplyStatus} [status] Filtro por status.
   * @returns {Promise<ReportReplyListResponseDto[]>} Lista de respostas denunciadas.
   */
  async execute(
    page: number,
    limit: number,
    status?: ReportReplyStatus,
  ): Promise<ReportReplyListResponseDto[]> {
    const offset = page * limit;

    const results = await this.repository.findGroupedByReply(
      status,
      true,
      offset,
      limit,
    );

    return results.map((result) =>
      plainToInstance(
        ReportReplyListResponseDto,
        { ...result, status: result.status },
        {
          excludeExtraneousValues: true,
        },
      ),
    );
  }
}
