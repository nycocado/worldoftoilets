import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenService } from '@modules/refresh-token/refresh-token.service';
import { AUTH_EXCEPTIONS } from '@modules/auth/constants';

@Injectable()
export class LogoutUseCase {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  async execute(token: string): Promise<void> {
    const refreshToken = await this.refreshTokenService.getByToken(token);

    if (!refreshToken) {
      throw new UnauthorizedException(AUTH_EXCEPTIONS.REFRESH_TOKEN_INVALID);
    }

    await this.refreshTokenService.revokeRefreshToken(refreshToken);
  }
}
