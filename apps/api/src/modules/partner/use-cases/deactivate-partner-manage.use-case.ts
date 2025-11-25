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
 * Contém a lógica de negócio para desativar uma parceria ativa (admin).
 */
@Injectable()
export class DeactivatePartnerManageUseCase {
  constructor(private readonly repository: PartnerRepository) {}

  /**
   * Desativa uma parceria que estava ativa.
   *
   * @param {string} publicId O ID público da parceria.
   * @returns {Promise<PartnerAdminResponseDto>} O DTO da parceria desativada.
   * @throws {NotFoundException} Se a parceria não for encontrada.
   * @throws {ConflictException} Se a parceria não estiver ativa.
   */
  @Transactional()
  async execute(publicId: string): Promise<PartnerAdminResponseDto> {
    const partner = await this.repository.findByPublicId(publicId);

    if (!partner) {
      throw new NotFoundException(PARTNER_EXCEPTIONS.PARTNER_NOT_FOUND);
    }

    if (partner.status !== PartnerStatus.ACTIVE) {
      throw new ConflictException(PARTNER_EXCEPTIONS.PARTNER_ALREADY_INACTIVE);
    }

    const deactivatedPartner = await this.repository.deactivate(partner);

    return plainToInstance(PartnerAdminResponseDto, deactivatedPartner, {
      excludeExtraneousValues: true,
    });
  }
}
