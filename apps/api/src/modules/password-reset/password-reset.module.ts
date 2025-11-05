import { Module } from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PasswordResetEntity } from '@database/entities';
import { VerifyTokenUseCase } from '@modules/password-reset/use-cases/verify-token.use-case';
import { PasswordResetRepository } from '@modules/password-reset/password-reset.repository';

@Module({
  imports: [MikroOrmModule.forFeature([PasswordResetEntity])],
  providers: [
    PasswordResetService,
    PasswordResetRepository,
    VerifyTokenUseCase,
  ],
  exports: [PasswordResetService],
})
export class PasswordResetModule {}
