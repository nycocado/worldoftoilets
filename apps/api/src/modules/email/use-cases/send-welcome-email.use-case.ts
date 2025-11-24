import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendHtmlEmailUseCase } from './send-html-email.use-case';

/**
 * Contém a lógica de negócio para o envio de um email de boas-vindas.
 */
@Injectable()
export class SendWelcomeEmailUseCase {
  constructor(
    private readonly sendHtmlEmailUseCase: SendHtmlEmailUseCase,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Envia um email de boas-vindas.
   *
   * @param {string} to O destinatário do email.
   * @param {string} userName O nome do utilizador.
   * @returns {Promise<boolean>} `true` se o email foi enviado com sucesso.
   */
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
        <p style="color: #666;">Happy toilet hunting!</p>
      </div>
    `;

    return this.sendHtmlEmailUseCase.execute(to, subject, html);
  }
}
