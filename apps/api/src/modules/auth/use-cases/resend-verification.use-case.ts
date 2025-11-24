import { Injectable, BadRequestException } from '@nestjs/common';
import { UserService } from '@modules/user';
import { EmailVerificationService } from '@modules/email-verification/email-verification.service';
import { EmailService } from '@modules/email/email.service';
import { ConfigService } from '@nestjs/config';
import { AUTH_EXCEPTIONS } from '@modules/auth/constants';
import { Transactional } from '@mikro-orm/mariadb';

/**
 * Implementa o caso de uso de reenvio de email de verificação.
 */
@Injectable()
export class ResendVerificationUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Executa a lógica de reenvio de email de verificação.
   *
   * @param {string} email O email do utilizador.
   * @returns {Promise<void>}
   * @throws {BadRequestException} Se o utilizador não existir ou o email já estiver verificado.
   */
  @Transactional()
  async execute(email: string): Promise<void> {
    const user = await this.userService.getUserByEmail(email);

    if (!user.credential) {
      return;
    }

    if (user.credential.emailVerified) {
      throw new BadRequestException(AUTH_EXCEPTIONS.EMAIL_ALREADY_VERIFIED);
    }

    const verification =
      await this.emailVerificationService.createVerificationToken(
        user.credential,
      );

    const verificationUrl = `${this.configService.getOrThrow('FRONTEND_URL')}/auth/verify-email?token=${verification.token}`;

    await this.emailService.sendVerificationEmail(
      email,
      user.name,
      verificationUrl,
    );
  }
}
