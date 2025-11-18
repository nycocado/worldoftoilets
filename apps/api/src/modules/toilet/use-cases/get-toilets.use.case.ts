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
 * Caso de Uso para Obter Lista de Toilets
 *
 * @class GetToiletsUseCase
 * @description Implementa a lógica de listagem de toilets com filtros opcionais.
 * Suporta filtros por localização, acesso, status, extras e paginação.
 *
 * @implements
 *   - Busca com múltiplos filtros opcionais
 *   - Paginação de resultados
 *   - Filtro por localização (cidade, país, código do país)
 *   - Filtro por tipo de acesso e extras
 *   - Transformação de entidades para DTOs
 *
 * @example
 * const toilets = await getToiletsUseCase.execute(
 *   'Lisboa',          // city
 *   'Portugal',        // country
 *   'PT',             // countryCode
 *   'PUBLIC',         // access
 *   'ACTIVE',         // status
 *   new Date(),       // timestamp
 *   true,             // pageable
 *   0,                // page
 *   20,               // size
 *   ['WIFI']          // extras
 * );
 *
 * @see ToiletRepository - Repositório para busca de dados
 */
@Injectable()
export class GetToiletsUseCase {
  /**
   * Construtor do GetToiletsUseCase
   *
   * @param {ToiletRepository} repository - Repositório de toilets
   */
  constructor(private readonly repository: ToiletRepository) {}

  /**
   * Executar caso de uso de obter lista de toilets
   *
   * @async
   * @param {string} [city] - Filtrar por cidade
   * @param {string} [country] - Filtrar por país
   * @param {string} [countryCode] - Filtrar por código ISO do país
   * @param {AccessApiName} [access] - Filtrar por tipo de acesso
   * @param {ToiletStatus} [status] - Filtrar por status
   * @param {Date} [timestamp] - Filtrar por data de atualização
   * @param {boolean} [pageable] - Ativar paginação
   * @param {number} [page] - Número da página
   * @param {number} [size] - Tamanho da página
   * @param {TypeExtraApiName[]} [typeExtra] - Filtrar por extras disponíveis
   * @returns {Promise<ToiletResponseDto[]>} Lista de DTOs de toilets
   *
   * @description
   * 1. Aplica filtros opcionais de localização, acesso, status e extras
   * 2. Aplica paginação se solicitado
   * 3. Busca toilets no repositório
   * 4. Transforma entidades em ToiletResponseDto[]
   * 5. Retorna lista de DTOs com dados completos
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
