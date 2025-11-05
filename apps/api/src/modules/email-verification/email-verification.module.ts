import { Module } from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EmailVerificationEntity } from '@database/entities';
import { EmailVerificationRepository } from '@modules/email-verification/email-verification.repository';
import { VerifyEmailUseCase } from '@modules/email-verification/use-cases/verify-email.use-case';

@Module({
  imports: [MikroOrmModule.forFeature([EmailVerificationEntity])],
  providers: [
    EmailVerificationService,
    EmailVerificationRepository,
    VerifyEmailUseCase,
  ],
  exports: [EmailVerificationService],
})
export class EmailVerificationModule {}
