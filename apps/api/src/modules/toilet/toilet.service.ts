import { Injectable, NotFoundException } from '@nestjs/common';
import { ToiletRepository } from '@modules/toilet/toilet.repository';
import { TOILET_EXCEPTIONS } from '@modules/toilet/constants/exceptions.constant';
import { ToiletEntity, ToiletStatus } from '@database/entities';

/**
 * Serviço de Toilets
 *
 * @class ToiletService
 * @description Serviço de alto nível para gestão de toilets.
 * Oferece operações de obtenção de toilets por ID e pesquisa full-text.
 *
 * @implements
 *   - Obtenção de toilet por ID público
 *   - Pesquisa full-text de toilets
 *
 * @see ToiletRepository - Repositório para acesso aos dados
 */
@Injectable()
export class ToiletService {
  /**
   * Construtor do ToiletService
   *
   * @param {ToiletRepository} toiletRepository - Repositório para operações de toilets
   */
  constructor(private readonly toiletRepository: ToiletRepository) {}

  /**
   * Obter toilet por ID público
   *
   * @async
   * @param {string} publicId - ID público UUID do toilet
   * @returns {Promise<ToiletEntity>} Entidade do toilet encontrado
   * @throws {NotFoundException} Quando toilet não é encontrado
   *
   * @description
   * Busca toilet pelo ID público. Se não encontrado, lança exceção.
   * Retorna toilet com população de relações (access, extras, ratings).
   */
  async getToiletByPublicId(publicId: string): Promise<ToiletEntity> {
    const toilet = await this.toiletRepository.findByPublicId(publicId);
    if (!toilet) {
      throw new NotFoundException(TOILET_EXCEPTIONS.TOILET_NOT_FOUND);
    }
    return toilet;
  }

  /**
   * Pesquisar toilets por full-text
   *
   * @async
   * @param {string} query - Termo de pesquisa
   * @param {boolean} [pageable] - Se deve paginar resultados
   * @param {number} [page] - Número da página (se paginado)
   * @param {number} [size] - Tamanho da página (se paginado)
   * @param {ToiletStatus} [status] - Status para filtrar
   * @returns {Promise<ToiletEntity[]>} Lista de toilets encontrados
   *
   * @description
   * Realiza pesquisa full-text em name e address dos toilets usando MySQL MATCH AGAINST.
   * Resultados são ordenados por relevância. Suporta paginação e filtro por status.
   */
  async getToiletsByFullTextSearch(
    query: string,
    pageable?: boolean,
    page?: number,
    size?: number,
    status?: ToiletStatus,
  ): Promise<ToiletEntity[]> {
    return this.toiletRepository.findByFullTextSearch(
      query,
      pageable,
      page,
      size,
      status,
    );
  }
}
