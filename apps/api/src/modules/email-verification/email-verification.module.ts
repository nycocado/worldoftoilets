import { Module } from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EmailVerificationEntity } from '@database/entities';

@Module({
  imports: [MikroOrmModule.forFeature([EmailVerificationEntity])],
  providers: [EmailVerificationService],
  exports: [EmailVerificationService],
})
export class EmailVerificationModule {}
