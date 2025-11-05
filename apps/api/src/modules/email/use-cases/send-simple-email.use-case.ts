import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SendSimpleEmailUseCase {
  private readonly logger = new Logger(SendSimpleEmailUseCase.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async execute(to: string, subject: string, text: string): Promise<boolean> {
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
}
