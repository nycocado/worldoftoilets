import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SendHtmlEmailUseCase {
  private readonly logger = new Logger(SendHtmlEmailUseCase.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

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
