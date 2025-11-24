import { Injectable } from '@nestjs/common';
import { SendSimpleEmailUseCase } from '@modules/email/use-cases';
import { SendHtmlEmailUseCase } from '@modules/email/use-cases';
import { SendVerificationEmailUseCase } from '@modules/email/use-cases';
import { SendPasswordResetEmailUseCase } from '@modules/email/use-cases';
import { SendWelcomeEmailUseCase } from '@modules/email/use-cases';
import { SendPartnerApprovalEmailUseCase } from '@modules/email/use-cases';
import { SendPartnerRejectionEmailUseCase } from '@modules/email/use-cases';

/**
 * Contém a lógica de negócio para as operações de envio de emails.
 */
@Injectable()
export class EmailService {
  constructor(
    private readonly sendSimpleEmailUseCase: SendSimpleEmailUseCase,
    private readonly sendHtmlEmailUseCase: SendHtmlEmailUseCase,
    private readonly sendVerificationEmailUseCase: SendVerificationEmailUseCase,
    private readonly sendPasswordResetEmailUseCase: SendPasswordResetEmailUseCase,
    private readonly sendWelcomeEmailUseCase: SendWelcomeEmailUseCase,
    private readonly sendPartnerApprovalEmailUseCase: SendPartnerApprovalEmailUseCase,
    private readonly sendPartnerRejectionEmailUseCase: SendPartnerRejectionEmailUseCase,
  ) {}

  /**
   * Envia um email de texto simples.
   *
   * @param {string} to O destinatário do email.
   * @param {string} subject O assunto do email.
   * @param {string} text O corpo do email em texto simples.
   * @returns {Promise<boolean>} `true` se o email foi enviado com sucesso.
   */
  async sendSimpleEmail(
    to: string,
    subject: string,
    text: string,
  ): Promise<boolean> {
    return this.sendSimpleEmailUseCase.execute(to, subject, text);
  }

  /**
   * Envia um email com conteúdo HTML.
   *
   * @param {string} to O destinatário do email.
   * @param {string} subject O assunto do email.
   * @param {string} html O corpo do email em HTML.
   * @returns {Promise<boolean>} `true` se o email foi enviado com sucesso.
   */
  async sendHtmlEmail(
    to: string,
    subject: string,
    html: string,
  ): Promise<boolean> {
    return this.sendHtmlEmailUseCase.execute(to, subject, html);
  }

  /**
   * Envia um email de verificação de conta.
   *
   * @param {string} to O destinatário do email.
   * @param {string} userName O nome do utilizador.
   * @param {string} verificationUrl O URL de verificação.
   * @returns {Promise<boolean>} `true` se o email foi enviado com sucesso.
   */
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

  /**
   * Envia um email de redefinição de password.
   *
   * @param {string} to O destinatário do email.
   * @param {string} userName O nome do utilizador.
   * @param {string} resetUrl O URL de redefinição.
   * @returns {Promise<boolean>} `true` se o email foi enviado com sucesso.
   */
  async sendPasswordResetEmail(
    to: string,
    userName: string,
    resetUrl: string,
  ): Promise<boolean> {
    return this.sendPasswordResetEmailUseCase.execute(to, userName, resetUrl);
  }

  /**
   * Envia um email de boas-vindas.
   *
   * @param {string} to O destinatário do email.
   * @param {string} userName O nome do utilizador.
   * @returns {Promise<boolean>} `true` se o email foi enviado com sucesso.
   */
  async sendWelcomeEmail(to: string, userName: string): Promise<boolean> {
    return this.sendWelcomeEmailUseCase.execute(to, userName);
  }

  /**
   * Envia um email de aprovação de parceria.
   *
   * @param {string} to O destinatário do email.
   * @param {string} email O email de login.
   * @param {string} password A senha temporária.
   * @returns {Promise<boolean>} `true` se o email foi enviado com sucesso.
   */
  async sendPartnerApprovalEmail(
    to: string,
    email: string,
    password: string,
  ): Promise<boolean> {
    return this.sendPartnerApprovalEmailUseCase.execute(to, email, password);
  }

  /**
   * Envia um email de rejeição de parceria.
   *
   * @param {string} to O destinatário do email.
   * @param {string} toiletName O nome da casa de banho.
   * @returns {Promise<boolean>} `true` se o email foi enviado com sucesso.
   */
  async sendPartnerRejectionEmail(
    to: string,
    toiletName: string,
  ): Promise<boolean> {
    return this.sendPartnerRejectionEmailUseCase.execute(to, toiletName);
  }
}
