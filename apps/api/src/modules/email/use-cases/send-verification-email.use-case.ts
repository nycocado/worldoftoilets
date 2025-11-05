import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendHtmlEmailUseCase } from './send-html-email.use-case';

@Injectable()
export class SendVerificationEmailUseCase {
  constructor(
    private readonly sendHtmlEmailUseCase: SendHtmlEmailUseCase,
    private readonly configService: ConfigService,
  ) {}

  async execute(
    to: string,
    userName: string,
    verificationUrl: string,
  ): Promise<boolean> {
    const subject = 'Verify your email address';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to World of Toilets, ${userName}!</h2>
        <p>Thanks for signing up. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #4CAF50; color: white; padding: 14px 28px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
        <p style="color: #999; font-size: 12px; margin-top: 40px;">
          If you didn't create an account, you can safely ignore this email.
        </p>
      </div>
    `;

    return this.sendHtmlEmailUseCase.execute(to, subject, html);
  }
}
