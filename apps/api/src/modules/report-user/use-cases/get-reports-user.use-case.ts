import { Injectable } from '@nestjs/common';
import { ReportUserRepository } from '../report-user.repository';
import { ReportUserListResponseDto } from '../dto';
import { plainToInstance } from 'class-transformer';
import { ReportUserStatus } from '@database/entities';

/**
 * Contém a lógica de negócio para listar utilizadores denunciados.
 */
@Injectable()
export class GetReportsUserUseCase {
  constructor(private readonly repository: ReportUserRepository) {}

  /**
   * Lista utilizadores denunciados com agregações.
   *
   * @param {number} page Número da página.
   * @param {number} limit Itens por página.
   * @param {ReportUserStatus} [status] Filtro por status.
   * @returns {Promise<ReportUserListResponseDto[]>} Lista de utilizadores denunciados.
   */
  async execute(
    page: number,
    limit: number,
    status?: ReportUserStatus,
  ): Promise<ReportUserListResponseDto[]> {
    const offset = page * limit;

    const results = await this.repository.findGroupedByUser(
      status,
      true,
      offset,
      limit,
    );

    return results.map((result) =>
      plainToInstance(
        ReportUserListResponseDto,
        { ...result, status: result.status },
        {
          excludeExtraneousValues: true,
        },
      ),
    );
  }
}
