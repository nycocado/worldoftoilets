import { Injectable, NotFoundException } from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { PartnerRepository } from '@modules/partner/partner.repository';
import { PartnerSelfResponseDto } from '@modules/partner/dto';
import { plainToInstance } from 'class-transformer';
import { PARTNER_EXCEPTIONS } from '@modules/partner/constants';

/**
 * Contém a lógica de negócio para atualizar informações da própria parceria.
 */
@Injectable()
export class UpdatePartnerSelfUseCase {
  constructor(private readonly repository: PartnerRepository) {}

  /**
   * Atualiza as informações de contacto da parceria.
   *
   * @param {string} userPublicId O ID público do utilizador autenticado.
   * @param {string} [contactEmail] Novo e-mail de contacto.
   * @returns {Promise<PartnerSelfResponseDto>} O DTO com as informações atualizadas.
   * @throws {NotFoundException} Se o utilizador não tiver parceria.
   */
  @Transactional()
  async execute(
    userPublicId: string,
    contactEmail?: string,
  ): Promise<PartnerSelfResponseDto> {
    const partner = await this.repository.findByUserPublicId(userPublicId);

    if (!partner) {
      throw new NotFoundException(PARTNER_EXCEPTIONS.PARTNER_NOT_FOUND);
    }

    const updatedPartner = contactEmail
      ? await this.repository.updateContactEmail(partner, contactEmail)
      : partner;

    return plainToInstance(PartnerSelfResponseDto, updatedPartner, {
      excludeExtraneousValues: true,
    });
  }
}
