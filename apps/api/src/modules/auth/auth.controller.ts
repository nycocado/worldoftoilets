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
import {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
  VerifyEmailDto,
  ForgotPasswordRequestDto,
  ResetPasswordDto,
} from '@modules/auth/dto';
import { ConfigService } from '@nestjs/config';
import { jwtTimeToMilliseconds } from '@common/utils/jwt-time.util';
import { UserService } from '@modules/user';
import {
  RefreshTokenRequestDto,
  RefreshTokenResponseDto,
} from '@modules/refresh-token/dto';
import { ApiResponseDto } from '@common/dto/api-response.dto';
import { LogoutRequestDto } from '@modules/auth/dto/logout-request.dto';
import { LogoutAllRequestDto } from '@modules/auth/dto/logout-all-request.dto';

const AUTH_API_MESSAGES = {
  LOGIN_SUCCESS: 'Login realizado com sucesso.',
  REFRESH_SUCCESS: 'Token de acesso renovado com sucesso.',
  LOGOUT_SUCCESS: 'Logout realizado com sucesso.',
  LOGOUT_ALL_SUCCESS: 'Logout de todas as sessões realizado com sucesso.',
  REGISTER_SUCCESS:
    'Registo realizado com sucesso. Verifique o seu email para ativar a conta.',
  VERIFY_EMAIL_SUCCESS: 'Email verificado com sucesso. Pode fazer login agora.',
  RESEND_VERIFICATION_SUCCESS: 'Email de verificação reenviado com sucesso.',
  FORGOT_PASSWORD_SUCCESS:
    'Se o email existir, receberá instruções para redefinir a senha.',
  RESET_PASSWORD_SUCCESS:
    'Senha redefinida com sucesso. Pode fazer login agora.',
};

const AUTH_API_EXCEPTIONS = {
  REFRESH_TOKEN_REQUIRED: 'Refresh token é obrigatório para logout.',
  REFRESH_TOKEN_INVALID: 'Refresh token inválido',
};

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginRequestDto,
    @Res({ passthrough: true }) res: any,
  ): Promise<ApiResponseDto<LoginResponseDto>> {
    const { email, password } = loginDto;
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

    return new ApiResponseDto<LoginResponseDto>(
      AUTH_API_MESSAGES.LOGIN_SUCCESS,
      loginResponse,
    );
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterRequestDto,
  ): Promise<ApiResponseDto<RegisterResponseDto>> {
    const { name, email, password, icon, birthDate } = registerDto;
    return new ApiResponseDto<RegisterResponseDto>(
      AUTH_API_MESSAGES.REGISTER_SUCCESS,
      await this.authService.register(name, email, password, icon, birthDate),
    );
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: any,
    @Query() refreshDto?: RefreshTokenRequestDto,
  ): Promise<ApiResponseDto<RefreshTokenResponseDto>> {
    const refreshResponse = await this.authService.refreshAccessToken(
      refreshDto?.refreshToken || req.cookies?.['refreshToken'],
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

    return new ApiResponseDto<RefreshTokenResponseDto>(
      AUTH_API_MESSAGES.REFRESH_SUCCESS,
      refreshResponse,
    );
  }

  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: any,
    @Query() logoutDto?: LogoutRequestDto,
  ): Promise<ApiResponseDto> {
    const refreshToken =
      logoutDto?.refreshToken || req.cookies?.['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException(
        AUTH_API_EXCEPTIONS.REFRESH_TOKEN_REQUIRED,
      );
    }

    await this.authService.revokeRefreshToken(refreshToken);

    res.clearCookie('token');
    res.clearCookie('refreshToken');

    return new ApiResponseDto(AUTH_API_MESSAGES.LOGOUT_SUCCESS);
  }

  @Post('logout-all')
  async logoutAll(
    @Req() req: Request,
    @Res({ passthrough: true }) res: any,
    @Query() logoutAllDto?: LogoutAllRequestDto,
  ): Promise<ApiResponseDto> {
    const refreshToken =
      logoutAllDto?.refreshToken || req.cookies?.['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException(
        AUTH_API_EXCEPTIONS.REFRESH_TOKEN_REQUIRED,
      );
    }

    const user = await this.userService.getByRefreshToken(refreshToken);

    if (!user) {
      throw new UnauthorizedException(
        AUTH_API_EXCEPTIONS.REFRESH_TOKEN_INVALID,
      );
    }

    await this.authService.revokeAllRefreshTokens(refreshToken);

    res.clearCookie('token');
    res.clearCookie('refreshToken');

    return new ApiResponseDto(AUTH_API_MESSAGES.LOGOUT_ALL_SUCCESS);
  }

  @Post('verify-email')
  async verifyEmail(
    @Query() verifyDto: VerifyEmailDto,
  ): Promise<ApiResponseDto> {
    await this.authService.verifyEmail(verifyDto.token);
    return new ApiResponseDto(AUTH_API_MESSAGES.VERIFY_EMAIL_SUCCESS);
  }

  @Post('resend-verification')
  async resendVerification(
    @Query('email') email: string,
  ): Promise<ApiResponseDto> {
    await this.authService.resendVerificationEmail(email);
    return new ApiResponseDto(AUTH_API_MESSAGES.RESEND_VERIFICATION_SUCCESS);
  }

  @Post('forgot-password')
  async forgotPassword(
    @Query() forgotPasswordDto: ForgotPasswordRequestDto,
  ): Promise<ApiResponseDto> {
    await this.authService.forgotPassword(forgotPasswordDto.email);
    return new ApiResponseDto(AUTH_API_MESSAGES.FORGOT_PASSWORD_SUCCESS);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<ApiResponseDto> {
    await this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
    return new ApiResponseDto(AUTH_API_MESSAGES.RESET_PASSWORD_SUCCESS);
  }
}
