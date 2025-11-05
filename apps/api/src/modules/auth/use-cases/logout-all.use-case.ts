import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@modules/user';
import { RefreshTokenService } from '@modules/refresh-token/refresh-token.service';
import { AUTH_EXCEPTIONS } from '@modules/auth/constants';

@Injectable()
export class LogoutAllUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async execute(token: string): Promise<void> {
    const user = await this.userService.getByRefreshToken(token);

    if (!user) {
      throw new UnauthorizedException(AUTH_EXCEPTIONS.REFRESH_TOKEN_INVALID);
    }

    await this.refreshTokenService.revokeAllUserRefreshTokens(user);
  }
}
