import { Injectable } from '@nestjs/common';
import { SendSimpleEmailUseCase } from '@modules/email/use-cases';
import { SendHtmlEmailUseCase } from '@modules/email/use-cases';
import { SendVerificationEmailUseCase } from '@modules/email/use-cases';
import { SendPasswordResetEmailUseCase } from '@modules/email/use-cases';
import { SendWelcomeEmailUseCase } from '@modules/email/use-cases';

@Injectable()
export class EmailService {
  constructor(
    private readonly sendSimpleEmailUseCase: SendSimpleEmailUseCase,
    private readonly sendHtmlEmailUseCase: SendHtmlEmailUseCase,
    private readonly sendVerificationEmailUseCase: SendVerificationEmailUseCase,
    private readonly sendPasswordResetEmailUseCase: SendPasswordResetEmailUseCase,
    private readonly sendWelcomeEmailUseCase: SendWelcomeEmailUseCase,
  ) {}

  async sendSimpleEmail(
    to: string,
    subject: string,
    text: string,
  ): Promise<boolean> {
    return this.sendSimpleEmailUseCase.execute(to, subject, text);
  }

  async sendHtmlEmail(
    to: string,
    subject: string,
    html: string,
  ): Promise<boolean> {
    return this.sendHtmlEmailUseCase.execute(to, subject, html);
  }

  async sendVerificationEmail(
    to: string,
    userName: string,
    verificationUrl: string,
  ): Promise<boolean> {
    return this.sendVerificationEmailUseCase.execute(
      to,
      userName,
      verificationUrl,
    );
  }

  async sendPasswordResetEmail(
    to: string,
    userName: string,
    resetUrl: string,
  ): Promise<boolean> {
    return this.sendPasswordResetEmailUseCase.execute(to, userName, resetUrl);
  }

  async sendWelcomeEmail(to: string, userName: string): Promise<boolean> {
    return this.sendWelcomeEmailUseCase.execute(to, userName);
  }
}
