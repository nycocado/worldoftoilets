import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { PartnerRepository } from '@modules/partner/partner.repository';
import { UserService } from '@modules/user';
import { EmailService } from '@modules/email';
import { PARTNER_EXCEPTIONS } from '@modules/partner/constants';
import { PartnerStatus } from '@database/entities';

/**
 * Contém a lógica de negócio para rejeitar uma candidatura de parceria (admin).
 */
@Injectable()
export class RejectPartnerManageUseCase {
  constructor(
    private readonly repository: PartnerRepository,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Rejeita uma candidatura de parceria.
   *
   * @param {string} publicId O ID público da parceria.
   * @param {string} adminPublicId O ID público do administrador que está rejeitando.
   * @returns {Promise<void>}
   * @throws {NotFoundException} Se a parceria não for encontrada.
   * @throws {ConflictException} Se a parceria não estiver pendente.
   */
  @Transactional()
  async execute(publicId: string, adminPublicId: string): Promise<void> {
    const partner = await this.repository.findByPublicId(publicId);

    if (!partner) {
      throw new NotFoundException(PARTNER_EXCEPTIONS.PARTNER_NOT_FOUND);
    }

    if (partner.status !== PartnerStatus.PENDING) {
      throw new ConflictException(PARTNER_EXCEPTIONS.APPLICATION_NOT_PENDING);
    }

    const admin = await this.userService.getUserByPublicId(adminPublicId);

    await this.repository.reject(partner, admin);

    await this.emailService.sendPartnerRejectionEmail(
      partner.contactEmail,
      partner.toilet.name,
    );
  }
}
