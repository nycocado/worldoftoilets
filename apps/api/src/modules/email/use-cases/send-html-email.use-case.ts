import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

/**
 * Contém a lógica de negócio para o envio de um email com conteúdo HTML.
 */
@Injectable()
export class SendHtmlEmailUseCase {
  private readonly logger = new Logger(SendHtmlEmailUseCase.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Envia um email com conteúdo HTML.
   *
   * @param {string} to O destinatário do email.
   * @param {string} subject O assunto do email.
   * @param {string} html O corpo do email em HTML.
   * @returns {Promise<boolean>} `true` se o email foi enviado com sucesso.
   */
  async execute(to: string, subject: string, html: string): Promise<boolean> {
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
}
