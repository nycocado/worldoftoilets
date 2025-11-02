import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@modules/user';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from '@modules/auth/dto';
import * as bcrypt from 'bcrypt';
import { RoleApiName } from '@database/entities';
import { RefreshTokenService } from '@modules/refresh-token/refresh-token.service';
import { RefreshTokenResponseDto } from '@modules/refresh-token/dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async createAccessToken(
    userId: number,
    publicId: string,
    roles: RoleApiName[],
  ): Promise<string> {
    const payload = {
      sub: userId,
      publicId: publicId,
      roles: roles,
    };

    return this.jwtService.sign(payload);
  }

  async login(email: string, password: string): Promise<LoginResponseDto> {
    const user = await this.userService.getByEmail(email);

    if (!user.credential) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.credential.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const accessToken = await this.createAccessToken(
      user.id,
      user.publicId,
      user.roles.map((role) => role.apiName),
    );

    const refreshToken =
      await this.refreshTokenService.createRefreshToken(user);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken.token,
      user: {
        publicId: user.publicId,
        name: user.name,
        email: user.credential.email,
        icon: user.icon,
      },
    };
  }

  async revokeRefreshToken(token: string): Promise<void> {
    const refreshToken = await this.refreshTokenService.getByToken(token);
    await this.refreshTokenService.revokeRefreshToken(refreshToken);
  }

  async revokeAllRefreshTokens(userId: number): Promise<void> {
    await this.refreshTokenService.revokeAllUserRefreshTokens(userId);
  }

  async refreshAccessToken(token: string): Promise<RefreshTokenResponseDto> {
    const refreshToken = await this.refreshTokenService.getByToken(token);

    if (refreshToken.expiresAt < new Date() || refreshToken.invalidAt) {
      throw new UnauthorizedException('Refresh token expirado');
    }

    const accessToken = await this.createAccessToken(
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
