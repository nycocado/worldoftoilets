import { Injectable } from '@nestjs/common';
import { ToiletRepository } from '@modules/toilet';
import {
  AccessApiName,
  ToiletStatus,
  TypeExtraApiName,
} from '@database/entities';
import { ToiletResponseDto } from '@modules/toilet/dto';
import { plainToInstance } from 'class-transformer';
import { UserService } from '@modules/user/user.service';

/**
 * Contém a lógica de negócio para a busca de casas de banho por proximidade.
 */
@Injectable()
export class GetToiletsByProximityUseCase {
  constructor(
    private readonly repository: ToiletRepository,
    private readonly userService: UserService,
  ) {}

  /**
   * Busca casas de banho próximas a um ponto geográfico, ordenadas por distância.
   *
   * @param {number} lat A latitude do ponto central.
   * @param {number} lng A longitude do ponto central.
   * @param {AccessApiName} [access] Filtra por tipo de acesso.
   * @param {ToiletStatus} [status] Filtra por status.
   * @param {Date} [timestamp] Filtra por data de criação/atualização.
   * @param {boolean} [pageable] Ativa a paginação.
   * @param {number} [page] O número da página.
   * @param {number} [size] O tamanho da página.
   * @param {TypeExtraApiName[]} [typeExtra] Filtra por recursos extra.
   * @param {string} [userPublicId] O ID público do utilizador, para filtrar casas de banho denunciadas por ele.
   * @returns {Promise<ToiletResponseDto[]>} Uma lista de DTOs de casas de banho.
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
    userPublicId?: string,
  ): Promise<ToiletResponseDto[]> {
    const user = userPublicId
      ? await this.userService.getUserByPublicId(userPublicId)
      : undefined;

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
      user,
    );

    return plainToInstance(ToiletResponseDto, toilets, {
      excludeExtraneousValues: true,
    });
  }
}
