import { Injectable } from '@nestjs/common';
import { EmailVerificationService } from '@modules/email-verification/email-verification.service';
import { EmailService } from '@modules/email/email.service';
import { Transactional } from '@mikro-orm/mariadb';

/**
 * Implementa o caso de uso de verificação de email.
 */
@Injectable()
export class VerifyEmailUseCase {
  constructor(
    private readonly emailVerificationService: EmailVerificationService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Executa a lógica de verificação de email.
   *
   * @param {string} token O token UUID de verificação.
   * @returns {Promise<void>}
   * @throws {BadRequestException} Se o token for inválido, expirado ou já utilizado.
   */
  @Transactional()
  async execute(token: string): Promise<void> {
    const userCredential =
      await this.emailVerificationService.verifyToken(token);

    await this.emailService.sendWelcomeEmail(
      userCredential.email,
      userCredential.user.name,
    );
  }
}
