import { Injectable } from '@nestjs/common';
import { SendHtmlEmailUseCase } from './send-html-email.use-case';

/**
 * Contém a lógica de negócio para o envio de um email de aprovação de parceria.
 */
@Injectable()
export class SendPartnerApprovalEmailUseCase {
  constructor(private readonly sendHtmlEmailUseCase: SendHtmlEmailUseCase) {}

  /**
   * Envia um email de aprovação de parceria com as credenciais de acesso.
   *
   * @param {string} to O destinatário do email.
   * @param {string} email O email de login.
   * @param {string} password A senha temporária gerada.
   * @returns {Promise<boolean>} `true` se o email foi enviado com sucesso.
   */
  async execute(to: string, email: string, password: string): Promise<boolean> {
    const subject = 'Partnership Application Approved';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">Application Approved! 🎉</h2>
        <p>Congratulations! Your partnership application has been approved.</p>
        <p>You can now access your partner account with the following credentials:</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 5px 0;"><strong>Temporary Password:</strong> <code style="background-color: #fff; padding: 5px 10px; border-radius: 3px;">${password}</code></p>
        </div>
        <p style="color: #ff6b6b; margin-top: 20px;">
          <strong>Important:</strong> Please log in and change your password as soon as possible.
        </p>
        <p style="margin-top: 30px;">As a partner, you'll have access to:</p>
        <ul>
          <li>Manage your toilet's information</li>
          <li>View and respond to reviews</li>
          <li>Update accessibility features</li>
          <li>Access partnership dashboard</li>
        </ul>
        <p style="color: #666; margin-top: 30px;">Welcome to the World of Toilets partner network!</p>
      </div>
    `;

    return this.sendHtmlEmailUseCase.execute(to, subject, html);
  }
}
