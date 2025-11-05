import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '@modules/refresh-token/refresh-token.service';
import { RefreshTokenResponseDto } from '@modules/auth/dto';
import { createAccessToken } from '@modules/auth/utils/token.utils';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async execute(token: string): Promise<RefreshTokenResponseDto> {
    const refreshToken = await this.refreshTokenService.getByToken(token);

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token inválido.');
    }

    if (refreshToken.expiresAt < new Date() || refreshToken.invalidAt) {
      throw new UnauthorizedException('Refresh token expirado.');
    }

    const accessToken = await createAccessToken(
      this.jwtService,
      refreshToken.user.id,
      refreshToken.user.publicId,
      refreshToken.user.roles.map((role) => role.apiName),
    );

    const newRefreshToken = await this.refreshTokenService.createRefreshToken(
      refreshToken.user,
    );
    await this.refreshTokenService.revokeRefreshToken(refreshToken);

    return {
      accessToken: accessToken,
      refreshToken: newRefreshToken.token,
    };
  }
}
