import { Injectable } from '@nestjs/common';
import { UserService } from '@modules/user';
import { PasswordResetService } from '@modules/password-reset/password-reset.service';
import { EmailService } from '@modules/email/email.service';
import { ConfigService } from '@nestjs/config';
import { Transactional } from '@mikro-orm/mariadb';

/**
 * Implementa o caso de uso de recuperação de password.
 */
@Injectable()
export class ForgotPasswordUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly passwordResetService: PasswordResetService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Executa a lógica de recuperação de password.
   *
   * @param {string} email O email do utilizador.
   * @returns {Promise<void>}
   */
  @Transactional()
  async execute(email: string): Promise<void> {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      return;
    }

    if (user.credential) {
      const reset = await this.passwordResetService.createResetToken(
        user.credential,
      );

      const resetUrl = `${this.configService.getOrThrow('FRONTEND_URL')}/auth/reset-password?token=${reset.token}`;

      await this.emailService.sendPasswordResetEmail(
        email,
        user.name,
        resetUrl,
      );
    }
  }
}
