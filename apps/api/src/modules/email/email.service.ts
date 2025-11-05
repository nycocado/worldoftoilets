import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendSimpleEmail(
    to: string,
    subject: string,
    text: string,
  ): Promise<boolean> {
    try {
      const from = this.configService.getOrThrow('MAIL_FROM');

      await this.mailerService.sendMail({
        to,
        from,
        subject,
        text,
      });

      this.logger.log(`Email sent to ${to} - Subject: "${subject}"`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error);
      return false;
    }
  }

  async sendHtmlEmail(
    to: string,
    subject: string,
    html: string,
  ): Promise<boolean> {
    try {
      const from = this.configService.getOrThrow('MAIL_FROM');

      await this.mailerService.sendMail({
        to,
        from,
        subject,
        html,
      });

      this.logger.log(`HTML email sent to ${to} - Subject: "${subject}"`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send HTML email to ${to}`, error);
      return false;
    }
  }

  async sendVerificationEmail(
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

    return this.sendHtmlEmail(to, subject, html);
  }

  async sendPasswordResetEmail(
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

    return this.sendHtmlEmail(to, subject, html);
  }

  async sendWelcomeEmail(to: string, userName: string): Promise<boolean> {
    const subject = 'Welcome to World of Toilets!';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome aboard, ${userName}! 🚽</h2>
        <p>Your email has been verified and your account is now active.</p>
        <p>You can now:</p>
        <ul>
          <li>Find and review toilets near you</li>
          <li>Share your experiences with the community</li>
          <li>Help others find clean and accessible facilities</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${this.configService.get('APP_URL', 'http://localhost:3000')}"
             style="background-color: #4CAF50; color: white; padding: 14px 28px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Start Exploring
          </a>
        </div>
        <p style="color: #666;">Happy toilet hunting!</p>
      </div>
    `;

    return this.sendHtmlEmail(to, subject, html);
  }
}
