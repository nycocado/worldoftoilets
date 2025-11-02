import type { Request } from 'express';
import {
  Body,
  Controller,
  Post,
  Res,
  Req,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto, LoginResponseDto } from '@modules/auth/dto';
import { ConfigService } from '@nestjs/config';
import { jwtTimeToMilliseconds } from '@common/utils/jwt-time.util';
import { UserService } from '@modules/user';
import {
  RefreshTokenRequestDto,
  RefreshTokenResponseDto,
} from '@modules/refresh-token/dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  async login(
    @Body() LoginDto: LoginRequestDto,
    @Res({ passthrough: true }) res: any,
  ): Promise<LoginResponseDto> {
    const { email, password } = LoginDto;
    const loginResponse = await this.authService.login(email, password);

    const jwtExpiration =
      this.configService.getOrThrow<string>('JWT_EXPIRATION');
    const maxAge = jwtTimeToMilliseconds(jwtExpiration);

    res.cookie('token', loginResponse.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge,
    });

    const refreshExpiration = this.configService.getOrThrow<string>(
      'JWT_REFRESH_EXPIRATION',
    );
    const refreshMaxAge = jwtTimeToMilliseconds(refreshExpiration);

    res.cookie('refreshToken', loginResponse.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: refreshMaxAge,
    });

    return loginResponse;
  }

  @Post('refresh')
  async refresh(
    @Body() refreshDto: RefreshTokenRequestDto,
    @Res({ passthrough: true }) res: any,
  ): Promise<RefreshTokenResponseDto> {
    const refreshResponse = await this.authService.refreshAccessToken(
      refreshDto.refreshToken,
    );

    const jwtExpiration =
      this.configService.getOrThrow<string>('JWT_EXPIRATION');
    const maxAge = jwtTimeToMilliseconds(jwtExpiration);

    res.cookie('token', refreshResponse.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge,
    });

    const refreshExpiration = this.configService.get<string>(
      'JWT_REFRESH_EXPIRATION',
      '30d',
    );
    const refreshMaxAge = jwtTimeToMilliseconds(refreshExpiration);

    res.cookie('refreshToken', refreshResponse.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: refreshMaxAge,
    });

    return refreshResponse;
  }

  @Post('logout')
  async logout(
    @Query('refreshToken') token: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: any,
  ): Promise<{ message: string }> {
    const refreshToken = token || req.cookies?.['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException(
        'Refresh token é obrigatório para logout',
      );
    }

    await this.authService.revokeRefreshToken(refreshToken);

    res.clearCookie('token');
    res.clearCookie('refreshToken');

    return { message: 'Logout realizado com sucesso' };
  }

  @Post('logout-all')
  async logoutAll(
    @Query('refreshToken') token: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: any,
  ): Promise<{ message: string }> {
    const refreshToken = token || req.cookies?.['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException(
        'Refresh token é obrigatório para logout',
      );
    }

    const user = await this.userService.getByRefreshToken(refreshToken);
    await this.authService.revokeAllRefreshTokens(user.id);

    res.clearCookie('token');
    res.clearCookie('refreshToken');

    return { message: 'Logout de todas as sessões realizado com sucesso' };
  }
}
