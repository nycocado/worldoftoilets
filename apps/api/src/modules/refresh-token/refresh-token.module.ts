import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { RefreshTokenEntity } from '@database/entities';
import { RefreshTokenRepository } from '@modules/refresh-token/refresh-token.repository';

/**
 * Gerencia a funcionalidade de refresh tokens, agrupando seus componentes.
 */
@Module({
  imports: [MikroOrmModule.forFeature([RefreshTokenEntity])],
  providers: [RefreshTokenService, RefreshTokenRepository],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
