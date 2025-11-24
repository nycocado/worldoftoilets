import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';
import { SendHtmlEmailUseCase } from '@modules/email/use-cases/send-html-email.use-case';
import { SendPasswordResetEmailUseCase } from '@modules/email/use-cases/send-password-reset-email.use-case';
import { SendSimpleEmailUseCase } from '@modules/email/use-cases/send-simple-email.use-case';
import { SendVerificationEmailUseCase } from '@modules/email/use-cases/send-verification-email.use-case';
import { SendWelcomeEmailUseCase } from '@modules/email/use-cases/send-welcome-email.use-case';
import { SendPartnerApprovalEmailUseCase } from '@modules/email/use-cases/send-partner-approval-email.use-case';
import { SendPartnerRejectionEmailUseCase } from '@modules/email/use-cases/send-partner-rejection-email.use-case';

/**
 * Gerencia a funcionalidade de envio de emails, agrupando seus componentes.
 */
@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.getOrThrow('MAIL_HOST'),
          port: Number(config.getOrThrow('MAIL_PORT')),
          ignoreTLS: true,
        },
      }),
    }),
  ],
  providers: [
    EmailService,
    SendHtmlEmailUseCase,
    SendPasswordResetEmailUseCase,
    SendSimpleEmailUseCase,
    SendVerificationEmailUseCase,
    SendWelcomeEmailUseCase,
    SendPartnerApprovalEmailUseCase,
    SendPartnerRejectionEmailUseCase,
  ],
  exports: [EmailService],
})
export class EmailModule {}
