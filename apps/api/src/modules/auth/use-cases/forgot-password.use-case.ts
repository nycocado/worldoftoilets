import { Injectable } from '@nestjs/common';
import { UserService } from '@modules/user';
import { PasswordResetService } from '@modules/password-reset/password-reset.service';
import { EmailService } from '@modules/email/email.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ForgotPasswordUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly passwordResetService: PasswordResetService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.userService.getByEmail(email);

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
