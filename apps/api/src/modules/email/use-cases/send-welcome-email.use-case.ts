import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendHtmlEmailUseCase } from './send-html-email.use-case';

@Injectable()
export class SendWelcomeEmailUseCase {
  constructor(
    private readonly sendHtmlEmailUseCase: SendHtmlEmailUseCase,
    private readonly configService: ConfigService,
  ) {}

  async execute(to: string, userName: string): Promise<boolean> {
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

    return this.sendHtmlEmailUseCase.execute(to, subject, html);
  }
}
