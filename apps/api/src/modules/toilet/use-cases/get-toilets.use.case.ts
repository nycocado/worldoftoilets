import { Injectable } from '@nestjs/common';
import { ToiletRepository } from '@modules/toilet';
import { ToiletResponseDto } from '@modules/toilet/dto';
import {
  AccessApiName,
  ToiletStatus,
  TypeExtraApiName,
} from '@database/entities';
import { plainToInstance } from 'class-transformer';

/**
 * Contém a lógica de negócio para a listagem de casas de banho com filtros.
 */
@Injectable()
export class GetToiletsUseCase {
  constructor(private readonly repository: ToiletRepository) {}

  /**
   * Lista casas de banho com base em filtros opcionais de localização, acesso, status e extras.
   *
   * @param {string} [city] Filtra por cidade.
   * @param {string} [country] Filtra por país.
   * @param {string} [countryCode] Filtra por código do país.
   * @param {AccessApiName} [access] Filtra por tipo de acesso.
   * @param {ToiletStatus} [status] Filtra por status.
   * @param {Date} [timestamp] Filtra por data de criação/atualização.
   * @param {boolean} [pageable] Ativa a paginação.
   * @param {number} [page] O número da página.
   * @param {number} [size] O tamanho da página.
   * @param {TypeExtraApiName[]} [typeExtra] Filtra por recursos extra.
   * @returns {Promise<ToiletResponseDto[]>} Uma lista de DTOs de casas de banho.
   */
  async execute(
    city?: string,
    country?: string,
    countryCode?: string,
    access?: AccessApiName,
    status?: ToiletStatus,
    timestamp?: Date,
    pageable?: boolean,
    page?: number,
    size?: number,
    typeExtra?: TypeExtraApiName[],
  ): Promise<ToiletResponseDto[]> {
    const toilets = await this.repository.find(
      city,
      country,
      countryCode,
      access,
      status,
      timestamp,
      pageable,
      page,
      size,
      typeExtra,
    );

    return plainToInstance(ToiletResponseDto, toilets, {
      excludeExtraneousValues: true,
    });
  }
}
