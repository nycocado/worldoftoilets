import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@modules/user';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '@modules/refresh-token/refresh-token.service';
import { LoginResponseDto } from '@modules/auth/dto';
import { AUTH_EXCEPTIONS } from '@modules/auth/constants';
import { createAccessToken } from '@modules/auth/utils/token.utils';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async execute(email: string, password: string): Promise<LoginResponseDto> {
    const user = await this.userService.getByEmail(email);

    if (!user || !user.credential) {
      throw new UnauthorizedException(AUTH_EXCEPTIONS.INVALID_CREDENTIALS);
    }

    if (!user.credential.emailVerified) {
      throw new UnauthorizedException(AUTH_EXCEPTIONS.EMAIL_NOT_VERIFIED);
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.credential.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(AUTH_EXCEPTIONS.INVALID_CREDENTIALS);
    }

    const accessToken = await createAccessToken(
      this.jwtService,
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
}
