import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { RefreshTokenEntity } from '@database/entities';

@Module({
  imports: [MikroOrmModule.forFeature([RefreshTokenEntity])],
  providers: [RefreshTokenService],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
