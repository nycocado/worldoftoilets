import { Injectable } from '@nestjs/common';
import { SendHtmlEmailUseCase } from './send-html-email.use-case';

/**
 * Contém a lógica de negócio para o envio de um email de rejeição de parceria.
 */
@Injectable()
export class SendPartnerRejectionEmailUseCase {
  constructor(private readonly sendHtmlEmailUseCase: SendHtmlEmailUseCase) {}

  /**
   * Envia um email de rejeição de parceria.
   *
   * @param {string} to O destinatário do email.
   * @param {string} toiletName O nome da casa de banho.
   * @returns {Promise<boolean>} `true` se o email foi enviado com sucesso.
   */
  async execute(to: string, toiletName: string): Promise<boolean> {
    const subject = 'Partnership Application Update';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Partnership Application Update</h2>
        <p>Thank you for your interest in becoming a partner for <strong>${toiletName}</strong>.</p>
        <p>After careful review, we regret to inform you that we are unable to approve your partnership application at this time.</p>
        <p style="margin-top: 30px;">This decision may be due to:</p>
        <ul>
          <li>Incomplete or insufficient documentation</li>
          <li>Verification issues with the provided information</li>
          <li>Other administrative requirements</li>
        </ul>
        <p style="margin-top: 30px;">If you believe this decision was made in error or if you have additional information to provide, please contact our support team.</p>
        <p style="color: #666; margin-top: 30px;">Thank you for your understanding.</p>
      </div>
    `;

    return this.sendHtmlEmailUseCase.execute(to, subject, html);
  }
}
