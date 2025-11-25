import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { PartnerRepository } from '@modules/partner/partner.repository';
import { UserService } from '@modules/user';
import { UserCredentialService } from '@modules/user-credential/user-credential.service';
import { RoleService } from '@modules/role';
import { EmailService } from '@modules/email';
import { PARTNER_EXCEPTIONS } from '@modules/partner/constants';
import { PartnerStatus, RoleApiName, UserIcon } from '@database/entities';
import * as crypto from 'crypto';

/**
 * Contém a lógica de negócio para aprovar uma candidatura de parceria (admin).
 */
@Injectable()
export class ApprovePartnerManageUseCase {
  constructor(
    private readonly repository: PartnerRepository,
    private readonly userService: UserService,
    private readonly userCredentialService: UserCredentialService,
    private readonly roleService: RoleService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Aprova uma candidatura de parceria e cria a conta do utilizador.
   *
   * @param {string} publicId O ID público da parceria.
   * @param {string} adminPublicId O ID público do administrador que está aprovando.
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

    const generatedPassword = this.generateStrongPassword();

    const userName = partner.contactEmail.split('@')[0];

    const user = await this.userService.createUser(
      userName,
      UserIcon.ICON_DEFAULT,
      new Date('2000-01-01').toISOString(),
    );

    await this.roleService.assignDefaultRolesToUser(user);

    const partnerRoles = await this.roleService.getRolesByApiNames([
      RoleApiName.PARTNER,
    ]);
    if (partnerRoles.length > 0) {
      await this.roleService.assignRolesToUser(user, [RoleApiName.PARTNER]);
    }

    await this.userCredentialService.createUserCredential(
      user,
      partner.contactEmail,
      generatedPassword,
    );

    await this.repository.approve(partner, user, admin);

    await this.emailService.sendPartnerApprovalEmail(
      partner.contactEmail,
      partner.contactEmail,
      generatedPassword,
    );
  }

  /**
   * Gera uma senha forte aleatória.
   *
   * @returns {string} Uma senha forte de 16 caracteres.
   */
  private generateStrongPassword(): string {
    return crypto.randomBytes(16).toString('base64');
  }
}
