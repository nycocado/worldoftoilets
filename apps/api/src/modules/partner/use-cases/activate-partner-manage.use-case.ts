import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { PartnerRepository } from '@modules/partner/partner.repository';
import { PartnerAdminResponseDto } from '@modules/partner/dto';
import { plainToInstance } from 'class-transformer';
import { PARTNER_EXCEPTIONS } from '@modules/partner/constants';
import { PartnerStatus } from '@database/entities';

/**
 * Contém a lógica de negócio para reativar uma parceria inativa (admin).
 */
@Injectable()
export class ActivatePartnerManageUseCase {
  constructor(private readonly repository: PartnerRepository) {}

  /**
   * Reativa uma parceria que estava inativa.
   *
   * @param {string} publicId O ID público da parceria.
   * @returns {Promise<PartnerAdminResponseDto>} O DTO da parceria reativada.
   * @throws {NotFoundException} Se a parceria não for encontrada.
   * @throws {ConflictException} Se a parceria não estiver inativa.
   */
  @Transactional()
  async execute(publicId: string): Promise<PartnerAdminResponseDto> {
    const partner = await this.repository.findByPublicId(publicId);

    if (!partner) {
      throw new NotFoundException(PARTNER_EXCEPTIONS.PARTNER_NOT_FOUND);
    }

    if (partner.status !== PartnerStatus.INACTIVE) {
      throw new ConflictException(PARTNER_EXCEPTIONS.PARTNER_ALREADY_ACTIVE);
    }

    const activatedPartner = await this.repository.activate(partner);

    return plainToInstance(PartnerAdminResponseDto, activatedPartner, {
      excludeExtraneousValues: true,
    });
  }
}
