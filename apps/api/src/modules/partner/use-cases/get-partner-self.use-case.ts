import { Injectable, NotFoundException } from '@nestjs/common';
import { PartnerRepository } from '@modules/partner/partner.repository';
import { PartnerSelfResponseDto } from '@modules/partner/dto';
import { plainToInstance } from 'class-transformer';
import { PARTNER_EXCEPTIONS } from '@modules/partner/constants';

/**
 * Contém a lógica de negócio para obter as informações da própria parceria.
 */
@Injectable()
export class GetPartnerSelfUseCase {
  constructor(private readonly repository: PartnerRepository) {}

  /**
   * Obtém as informações da parceria do utilizador autenticado.
   *
   * @param {string} userPublicId O ID público do utilizador autenticado.
   * @returns {Promise<PartnerSelfResponseDto>} O DTO com as informações da parceria.
   * @throws {NotFoundException} Se o utilizador não tiver parceria.
   */
  async execute(userPublicId: string): Promise<PartnerSelfResponseDto> {
    const partner = await this.repository.findByUserPublicId(userPublicId);

    if (!partner) {
      throw new NotFoundException(PARTNER_EXCEPTIONS.PARTNER_NOT_FOUND);
    }

    return plainToInstance(PartnerSelfResponseDto, partner, {
      excludeExtraneousValues: true,
    });
  }
}
