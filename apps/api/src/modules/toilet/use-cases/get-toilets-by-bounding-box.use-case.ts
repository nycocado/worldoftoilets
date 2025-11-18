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
 * Caso de Uso para Obter Toilets por Bounding Box
 *
 * @class GetToiletsByBoundingBoxUseCase
 * @description Implementa a lógica de negócio para buscar toilets dentro de uma área geográfica retangular (bounding box).
 * Permite filtrar por tipo de acesso, status e extras.
 *
 * @implements
 *   - Busca de toilets em uma área geográfica definida por coordenadas
 *   - Filtragem por acesso, status e extras
 *   - Transformação de entidades para DTOs de resposta
 *
 * @example
 * const toilets = await getToiletsByBoundingBoxUseCase.execute(
 *   38.7, -9.1, 38.8, -9.0, // minLat, minLng, maxLat, maxLng
 *   'PUBLIC',
 *   'ACTIVE',
 *   new Date(),
 *   ['WIFI']
 * );
 *
 * @see ToiletRepository
 */
@Injectable()
export class GetToiletsByBoundingBoxUseCase {
  /**
   * Construtor do GetToiletsByBoundingBoxUseCase
   *
   * @param {ToiletRepository} repository - Repositório para operações de toilet
   */
  constructor(private readonly repository: ToiletRepository) {}

  /**
   * Executa o caso de uso para buscar toilets por bounding box.
   *
   * @async
   * @param {number} minLat - Latitude mínima da área de busca.
   * @param {number} minLng - Longitude mínima da área de busca.
   * @param {number} maxLat - Latitude máxima da área de busca.
   * @param {number} maxLng - Longitude máxima da área de busca.
   * @param {AccessApiName} [access] - Filtra por tipo de acesso (opcional).
   * @param {ToiletStatus} [status] - Filtra por status do toilet (opcional).
   * @param {Date} [timestamp] - Filtra por data de atualização (opcional).
   * @param {TypeExtraApiName[]} [typeExtra] - Filtra por extras disponíveis (opcional).
   * @returns {Promise<ToiletResponseDto[]>} Uma lista de DTOs de toilets encontrados na área.
   *
   * @description
   * 1. Busca no repositório todos os toilets que estão dentro das coordenadas geográficas fornecidas.
   * 2. Aplica filtros adicionais de acesso, status, timestamp e extras, se fornecidos.
   * 3. Transforma a lista de entidades de toilet em uma lista de DTOs.
   * 4. Retorna a lista de DTOs.
   */
  async execute(
    minLat: number,
    minLng: number,
    maxLat: number,
    maxLng: number,
    access?: AccessApiName,
    status?: ToiletStatus,
    timestamp?: Date,
    typeExtra?: TypeExtraApiName[],
  ): Promise<ToiletResponseDto[]> {
    const toilets = await this.repository.findByBoundingBox(
      minLat,
      minLng,
      maxLat,
      maxLng,
      access,
      status,
      timestamp,
      typeExtra,
    );

    return plainToInstance(ToiletResponseDto, toilets, {
      excludeExtraneousValues: true,
    });
  }
}
