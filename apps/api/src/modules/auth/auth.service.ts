import { Injectable } from '@nestjs/common';
import { LoginResponseDto, RefreshTokenResponseDto } from '@modules/auth/dto';
import { UserIcon } from '@database/entities';
import { LoginUseCase } from './use-cases/login.use-case';
import { RegisterUseCase } from './use-cases/register.use-case';
import { RefreshTokenUseCase } from './use-cases/refresh-token.use-case';
import { VerifyEmailUseCase } from './use-cases/verify-email.use-case';
import { ResendVerificationUseCase } from './use-cases/resend-verification.use-case';
import { ForgotPasswordUseCase } from './use-cases/forgot-password.use-case';
import { ResetPasswordUseCase } from './use-cases/reset-password.use-case';
import { LogoutUseCase } from './use-cases/logout.use-case';
import { LogoutAllUseCase } from './use-cases/logout-all.use-case';

@Injectable()
export class AuthService {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
    private readonly resendVerificationUseCase: ResendVerificationUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly logoutAllUseCase: LogoutAllUseCase,
  ) {}

  async login(email: string, password: string): Promise<LoginResponseDto> {
    return this.loginUseCase.execute(email, password);
  }

  async register(
    name: string,
    email: string,
    password: string,
    icon: UserIcon | undefined,
    birthDate: string,
  ): Promise<void> {
    return this.registerUseCase.execute(name, email, password, icon, birthDate);
  }

  async revokeRefreshToken(token: string): Promise<void> {
    return this.logoutUseCase.execute(token);
  }

  async revokeAllRefreshTokens(token: string): Promise<void> {
    return this.logoutAllUseCase.execute(token);
  }

  async refreshAccessToken(token: string): Promise<RefreshTokenResponseDto> {
    return this.refreshTokenUseCase.execute(token);
  }

  async verifyEmail(token: string): Promise<void> {
    return this.verifyEmailUseCase.execute(token);
  }

  async resendVerificationEmail(email: string): Promise<void> {
    return this.resendVerificationUseCase.execute(email);
  }

  async forgotPassword(email: string): Promise<void> {
    return this.forgotPasswordUseCase.execute(email);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    return this.resetPasswordUseCase.execute(token, newPassword);
  }
}
