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
 * Contém a lógica de negócio para a busca de casas de banho dentro de uma área geográfica.
 */
@Injectable()
export class GetToiletsByBoundingBoxUseCase {
  constructor(
    private readonly repository: ToiletRepository,
    private readonly userService: UserService,
  ) {}

  /**
   * Busca casas de banho dentro de uma área geográfica retangular (bounding box).
   *
   * @param {number} minLat A latitude mínima.
   * @param {number} minLng A longitude mínima.
   * @param {number} maxLat A latitude máxima.
   * @param {number} maxLng A longitude máxima.
   * @param {AccessApiName} [access] Filtra por tipo de acesso.
   * @param {ToiletStatus} [status] Filtra por status.
   * @param {Date} [timestamp] Filtra por data de criação/atualização.
   * @param {TypeExtraApiName[]} [typeExtra] Filtra por recursos extra.
   * @param {string} [userPublicId] O ID público do utilizador, para filtrar casas de banho denunciadas por ele.
   * @returns {Promise<ToiletResponseDto[]>} Uma lista de DTOs de casas de banho.
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
    userPublicId?: string,
  ): Promise<ToiletResponseDto[]> {
    const user = userPublicId
      ? await this.userService.getUserByPublicId(userPublicId)
      : undefined;

    const toilets = await this.repository.findByBoundingBox(
      minLat,
      minLng,
      maxLat,
      maxLng,
      access,
      status,
      timestamp,
      typeExtra,
      user,
    );

    return plainToInstance(ToiletResponseDto, toilets, {
      excludeExtraneousValues: true,
    });
  }
}
