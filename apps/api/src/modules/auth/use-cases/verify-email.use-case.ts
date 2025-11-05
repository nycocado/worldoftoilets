import { Injectable } from '@nestjs/common';
import { EmailVerificationService } from '@modules/email-verification/email-verification.service';
import { EmailService } from '@modules/email/email.service';

@Injectable()
export class VerifyEmailUseCase {
  constructor(
    private readonly emailVerificationService: EmailVerificationService,
    private readonly emailService: EmailService,
  ) {}

  async execute(token: string): Promise<void> {
    const userCredential =
      await this.emailVerificationService.verifyToken(token);

    await this.emailService.sendWelcomeEmail(
      userCredential.email,
      userCredential.user.name,
    );
  }
}
