import { Injectable } from '@nestjs/common';
import { ToiletRepository } from '@modules/toilet';
import {
  AccessApiName,
  ToiletStatus,
  TypeExtraApiName,
} from '@database/entities';
import { ToiletResponseDto } from '@modules/toilet/dto';
import { plainToInstance } from 'class-transformer';

/**
 * Caso de Uso para Obter Toilets por Proximidade
 *
 * @class GetToiletsByProximityUseCase
 * @description Implementa a lógica de negócio para buscar toilets próximos a um ponto geográfico.
 * A busca é ordenada pela distância, e suporta paginação e filtros.
 *
 * @implements
 *   - Busca de toilets ordenada por proximidade a um ponto (lat, lng)
 *   - Suporte a paginação
 *   - Filtragem por acesso, status e extras
 *   - Transformação de entidades para DTOs de resposta
 *
 * @example
 * const toilets = await getToiletsByProximityUseCase.execute(
 *   38.7, -9.1, // lat, lng
 *   'PUBLIC',
 *   'ACTIVE',
 *   new Date(),
 *   true, 0, 20, // pageable, page, size
 *   ['WIFI']
 * );
 *
 * @see ToiletRepository
 */
@Injectable()
export class GetToiletsByProximityUseCase {
  /**
   * Construtor do GetToiletsByProximityUseCase
   *
   * @param {ToiletRepository} repository - Repositório para operações de toilet
   */
  constructor(private readonly repository: ToiletRepository) {}

  /**
   * Executa o caso de uso para buscar toilets por proximidade.
   *
   * @async
   * @param {number} lat - Latitude do ponto central da busca.
   * @param {number} lng - Longitude do ponto central da busca.
   * @param {AccessApiName} [access] - Filtra por tipo de acesso (opcional).
   * @param {ToiletStatus} [status] - Filtra por status do toilet (opcional).
   * @param {Date} [timestamp] - Filtra por data de atualização (opcional).
   * @param {boolean} [pageable] - Define se a busca deve ser paginada (opcional).
   * @param {number} [page] - O número da página a ser retornada (opcional).
   * @param {number} [size] - O tamanho da página (opcional).
   * @param {TypeExtraApiName[]} [typeExtra] - Filtra por extras disponíveis (opcional).
   * @returns {Promise<ToiletResponseDto[]>} Uma lista de DTOs de toilets encontrados, ordenados por proximidade.
   *
   * @description
   * 1. Busca no repositório todos os toilets, ordenando-os pela distância ao ponto (lat, lng).
   * 2. Aplica filtros de acesso, status, timestamp e extras, se fornecidos.
   * 3. Aplica paginação se `pageable` for verdadeiro.
   * 4. Transforma a lista de entidades de toilet em uma lista de DTOs.
   * 5. Retorna a lista de DTOs.
   */
  async execute(
    lat: number,
    lng: number,
    access?: AccessApiName,
    status?: ToiletStatus,
    timestamp?: Date,
    pageable?: boolean,
    page?: number,
    size?: number,
    typeExtra?: TypeExtraApiName[],
  ): Promise<ToiletResponseDto[]> {
    const toilets = await this.repository.findByProximity(
      lat,
      lng,
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
