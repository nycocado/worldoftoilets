import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { RefreshTokenEntity } from '@database/entities';
import { RefreshTokenRepository } from '@modules/refresh-token/refresh-token.repository';

@Module({
  imports: [MikroOrmModule.forFeature([RefreshTokenEntity])],
  providers: [RefreshTokenService, RefreshTokenRepository],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
