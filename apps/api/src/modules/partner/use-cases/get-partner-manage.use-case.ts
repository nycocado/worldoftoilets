import { Injectable, NotFoundException } from '@nestjs/common';
import { PartnerRepository } from '@modules/partner/partner.repository';
import { PartnerAdminResponseDto } from '@modules/partner/dto';
import { plainToInstance } from 'class-transformer';
import { PARTNER_EXCEPTIONS } from '@modules/partner/constants';

/**
 * Contém a lógica de negócio para obter detalhes de uma parceria (admin).
 */
@Injectable()
export class GetPartnerManageUseCase {
  constructor(private readonly repository: PartnerRepository) {}

  /**
   * Obtém os detalhes completos de uma parceria.
   *
   * @param {string} publicId O ID público da parceria.
   * @returns {Promise<PartnerAdminResponseDto>} O DTO com os detalhes da parceria.
   * @throws {NotFoundException} Se a parceria não for encontrada.
   */
  async execute(publicId: string): Promise<PartnerAdminResponseDto> {
    const partner = await this.repository.findByPublicId(publicId);

    if (!partner) {
      throw new NotFoundException(PARTNER_EXCEPTIONS.PARTNER_NOT_FOUND);
    }

    return plainToInstance(PartnerAdminResponseDto, partner, {
      excludeExtraneousValues: true,
    });
  }
}
