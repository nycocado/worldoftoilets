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
  VerifyEmailRequestDto,
  ForgotPasswordRequestDto,
  ResetPasswordRequestDto,
  RefreshTokenRequestDto,
  RefreshTokenResponseDto,
  ResendVerificationRequestDto,
} from '@modules/auth/dto';
import { ConfigService } from '@nestjs/config';
import { jwtTimeToMilliseconds } from '@common/utils/jwt-time.util';
import { ApiResponseDto } from '@common/dto/api-response.dto';
import { LogoutRequestDto } from '@modules/auth/dto/logout-request.dto';
import { LogoutAllRequestDto } from '@modules/auth/dto/logout-all-request.dto';
import { AUTH_EXCEPTIONS, AUTH_MESSAGES } from '@modules/auth/constants';
import {
  ApiSwaggerForgotPassword,
  ApiSwaggerLogin,
  ApiSwaggerLogout,
  ApiSwaggerLogoutAll,
  ApiSwaggerRefresh,
  ApiSwaggerRegister,
  ApiSwaggerResendVerification,
  ApiSwaggerResetPassword,
  ApiSwaggerVerifyEmail,
} from '@modules/auth/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @ApiSwaggerLogin()
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
      AUTH_MESSAGES.LOGIN_SUCCESS,
      loginResponse,
    );
  }

  @ApiSwaggerRegister()
  @Post('register')
  async register(
    @Body() registerDto: RegisterRequestDto,
  ): Promise<ApiResponseDto> {
    const { name, email, password, icon, birthDate } = registerDto;
    await this.authService.register(name, email, password, icon, birthDate);
    return new ApiResponseDto(AUTH_MESSAGES.REGISTER_SUCCESS);
  }

  @ApiSwaggerRefresh()
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
      AUTH_MESSAGES.REFRESH_SUCCESS,
      refreshResponse,
    );
  }

  @ApiSwaggerLogout()
  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: any,
    @Query() logoutDto?: LogoutRequestDto,
  ): Promise<ApiResponseDto> {
    const refreshToken =
      logoutDto?.refreshToken || req.cookies?.['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException(AUTH_EXCEPTIONS.REFRESH_TOKEN_REQUIRED);
    }

    await this.authService.revokeRefreshToken(refreshToken);

    res.clearCookie('token');
    res.clearCookie('refreshToken');

    return new ApiResponseDto(AUTH_MESSAGES.LOGOUT_SUCCESS);
  }

  @ApiSwaggerLogoutAll()
  @Post('logout-all')
  async logoutAll(
    @Req() req: Request,
    @Res({ passthrough: true }) res: any,
    @Query() logoutAllDto?: LogoutAllRequestDto,
  ): Promise<ApiResponseDto> {
    const refreshToken =
      logoutAllDto?.refreshToken || req.cookies?.['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException(AUTH_EXCEPTIONS.REFRESH_TOKEN_REQUIRED);
    }

    await this.authService.revokeAllRefreshTokens(refreshToken);

    res.clearCookie('token');
    res.clearCookie('refreshToken');

    return new ApiResponseDto(AUTH_MESSAGES.LOGOUT_ALL_SUCCESS);
  }

  @ApiSwaggerVerifyEmail()
  @Post('verify-email')
  async verifyEmail(
    @Query() verifyEmailDto: VerifyEmailRequestDto,
  ): Promise<ApiResponseDto> {
    await this.authService.verifyEmail(verifyEmailDto.token);
    return new ApiResponseDto(AUTH_MESSAGES.VERIFY_EMAIL_SUCCESS);
  }

  @ApiSwaggerResendVerification()
  @Post('resend-verification')
  async resendVerification(
    @Query() resendVerificationDto: ResendVerificationRequestDto,
  ): Promise<ApiResponseDto> {
    await this.authService.resendVerificationEmail(resendVerificationDto.email);
    return new ApiResponseDto(AUTH_MESSAGES.RESEND_VERIFICATION_SUCCESS);
  }

  @ApiSwaggerForgotPassword()
  @Post('forgot-password')
  async forgotPassword(
    @Query() forgotPasswordDto: ForgotPasswordRequestDto,
  ): Promise<ApiResponseDto> {
    await this.authService.forgotPassword(forgotPasswordDto.email);
    return new ApiResponseDto(AUTH_MESSAGES.FORGOT_PASSWORD_SUCCESS);
  }

  @ApiSwaggerResetPassword()
  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordRequestDto,
  ): Promise<ApiResponseDto> {
    await this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
    return new ApiResponseDto(AUTH_MESSAGES.RESET_PASSWORD_SUCCESS);
  }
}
