import { Injectable } from '@nestjs/common';
import { PartnerRepository } from '@modules/partner/partner.repository';
import { PartnerAdminResponseDto } from '@modules/partner/dto';
import { plainToInstance } from 'class-transformer';
import { PartnerStatus } from '@database/entities';

/**
 * Contém a lógica de negócio para listar candidaturas de parceria (admin).
 */
@Injectable()
export class GetPartnersManageUseCase {
  constructor(private readonly repository: PartnerRepository) {}

  /**
   * Lista candidaturas de parceria com filtros.
   *
   * @param {PartnerStatus} [status] Filtrar por status.
   * @param {string} [search] Pesquisar por nome, e-mail ou toilet.
   * @param {Date} [timestamp] Filtrar por data de criação.
   * @param {boolean} [pageable] Ativar paginação.
   * @param {number} [page] Número da página.
   * @param {number} [size] Tamanho da página.
   * @returns {Promise<PartnerAdminResponseDto[]>} Lista de parcerias.
   */
  async execute(
    status?: PartnerStatus,
    search?: string,
    timestamp?: Date,
    pageable?: boolean,
    page?: number,
    size?: number,
  ): Promise<PartnerAdminResponseDto[]> {
    const partners = await this.repository.find(
      status,
      search,
      timestamp,
      pageable,
      page,
      size,
    );

    return partners.map((partner) =>
      plainToInstance(PartnerAdminResponseDto, partner, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
