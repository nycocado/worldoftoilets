import { Injectable } from '@nestjs/common';
import { SendHtmlEmailUseCase } from './send-html-email.use-case';

@Injectable()
export class SendPasswordResetEmailUseCase {
  constructor(private readonly sendHtmlEmailUseCase: SendHtmlEmailUseCase) {}

  async execute(
    to: string,
    userName: string,
    resetUrl: string,
  ): Promise<boolean> {
    const subject = 'Reset your password';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Hi ${userName},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #2196F3; color: white; padding: 14px 28px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; word-break: break-all;">${resetUrl}</p>
        <p style="color: #ff6b6b; margin-top: 30px;">
          This link will expire in 1 hour for security reasons.
        </p>
        <p style="color: #999; font-size: 12px; margin-top: 40px;">
          If you didn't request a password reset, please ignore this email or contact support if you have concerns.
        </p>
      </div>
    `;

    return this.sendHtmlEmailUseCase.execute(to, subject, html);
  }
}
