import { Injectable, NotFoundException } from '@nestjs/common';
import { ToiletRepository } from '@modules/toilet/toilet.repository';
import { TOILET_EXCEPTIONS } from '@modules/toilet/constants/exceptions.constant';
import { ToiletEntity, ToiletStatus } from '@database/entities';

/**
 * Contém a lógica de negócio para as operações relacionadas a casas de banho.
 */
@Injectable()
export class ToiletService {
  constructor(private readonly toiletRepository: ToiletRepository) {}

  /**
   * Busca uma casa de banho pelo seu ID público.
   *
   * @param {string} publicId O ID público da casa de banho.
   * @returns {Promise<ToiletEntity>} A entidade da casa de banho encontrada.
   * @throws {NotFoundException} Se a casa de banho não for encontrada.
   */
  async getToiletByPublicId(publicId: string): Promise<ToiletEntity> {
    const toilet = await this.toiletRepository.findByPublicId(publicId);
    if (!toilet) {
      throw new NotFoundException(TOILET_EXCEPTIONS.TOILET_NOT_FOUND);
    }
    return toilet;
  }

  /**
   * Realiza uma pesquisa full-text por casas de banho.
   *
   * @param {string} query O termo de pesquisa.
   * @param {boolean} [pageable] Define se a paginação deve ser aplicada.
   * @param {number} [page] O número da página.
   * @param {number} [size] O tamanho da página.
   * @param {ToiletStatus} [status] Filtra por status.
   * @returns {Promise<ToiletEntity[]>} Uma lista de casas de banho encontradas.
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

  /**
   * Altera o status de uma casa de banho.
   *
   * @param {ToiletEntity} toilet A entidade da casa de banho.
   * @param {ToiletStatus} status O novo status.
   * @returns {Promise<ToiletEntity>} A casa de banho com o status atualizado.
   */
  async changeToiletStatus(
    toilet: ToiletEntity,
    status: ToiletStatus,
  ): Promise<ToiletEntity> {
    return this.toiletRepository.changeStatus(toilet, status);
  }

  /**
   * Cria uma nova casa de banho.
   *
   * @param {any} access A entidade do tipo de acesso.
   * @param {string} name O nome da casa de banho.
   * @param {number} latitude A latitude da localização.
   * @param {number} longitude A longitude da localização.
   * @param {string} address A morada completa.
   * @param {string} city A cidade.
   * @param {string | undefined} state O estado/distrito.
   * @param {string} country O país.
   * @param {string} countryCode O código do país.
   * @param {ToiletStatus} status O status inicial.
   * @param {string | undefined} placeId O ID do Google Places.
   * @param {any[]} [extras] A lista de recursos extra.
   * @returns {Promise<ToiletEntity>} A casa de banho criada.
   */
  async createToilet(
    access: any,
    name: string,
    latitude: number,
    longitude: number,
    address: string,
    city: string,
    state: string | undefined,
    country: string,
    countryCode: string,
    status: ToiletStatus,
    placeId: string | undefined,
    extras?: any[],
  ): Promise<ToiletEntity> {
    return this.toiletRepository.create(
      access,
      name,
      latitude,
      longitude,
      address,
      city,
      state,
      country,
      countryCode,
      status,
      placeId,
      extras,
    );
  }

  /**
   * Atualiza o URL da foto de uma casa de banho.
   *
   * @param {ToiletEntity} toilet A entidade da casa de banho.
   * @param {string} photoUrl O novo URL da foto.
   * @returns {Promise<ToiletEntity>} A casa de banho com a foto atualizada.
   */
  async updatePhotoUrl(
    toilet: ToiletEntity,
    photoUrl: string,
  ): Promise<ToiletEntity> {
    return this.toiletRepository.updatePhotoUrl(toilet, photoUrl);
  }

  /**
   * Remove uma casa de banho permanentemente.
   *
   * @param {ToiletEntity} toilet A entidade da casa de banho a ser removida.
   * @returns {Promise<void>}
   */
  async deleteToilet(toilet: ToiletEntity): Promise<void> {
    return this.toiletRepository.delete(toilet);
  }
}
