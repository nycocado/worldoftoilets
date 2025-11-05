import { Module } from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PasswordResetEntity } from '@database/entities';

@Module({
  imports: [MikroOrmModule.forFeature([PasswordResetEntity])],
  providers: [PasswordResetService],
  exports: [PasswordResetService],
})
export class PasswordResetModule {}
