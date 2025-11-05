import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from '@modules/user';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto, RegisterResponseDto } from '@modules/auth/dto';
import * as bcrypt from 'bcrypt';
import { RoleApiName, UserEntity, UserIcon } from '@database/entities';
import { RefreshTokenService } from '@modules/refresh-token/refresh-token.service';
import { RefreshTokenResponseDto } from '@modules/refresh-token/dto';
import { EmailService } from '@modules/email/email.service';
import { ConfigService } from '@nestjs/config';
import { EmailVerificationService } from '@modules/email-verification/email-verification.service';
import { UserCredentialService } from '@modules/user-credential/user-credential.service';
import { PasswordResetService } from '@modules/password-reset/password-reset.service';

const AUTH_API_EXCEPTIONS = {
  INVALID_CREDENTIALS: 'Credenciais inválidas.',
  EMAIL_NOT_VERIFIED: 'Email não verificado.',
  REFRESH_TOKEN_INVALID: 'Refresh token inválido.',
  REFRESH_TOKEN_EXPIRED: 'Refresh token expirado.',
  USER_INVALID: 'Usuário inválido.',
};

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly userCredentialService: UserCredentialService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly passwordResetService: PasswordResetService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
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

    if (!user || !user.credential) {
      throw new UnauthorizedException(AUTH_API_EXCEPTIONS.INVALID_CREDENTIALS);
    }

    if (!user.credential.emailVerified) {
      throw new UnauthorizedException(AUTH_API_EXCEPTIONS.EMAIL_NOT_VERIFIED);
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.credential.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(AUTH_API_EXCEPTIONS.INVALID_CREDENTIALS);
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
    if (!refreshToken) {
      throw new UnauthorizedException(
        AUTH_API_EXCEPTIONS.REFRESH_TOKEN_INVALID,
      );
    }
    await this.refreshTokenService.revokeRefreshToken(refreshToken);
  }

  async revokeAllRefreshTokens(user: UserEntity): Promise<void> {
    await this.refreshTokenService.revokeAllUserRefreshTokens(user);
  }

  async refreshAccessToken(token: string): Promise<RefreshTokenResponseDto> {
    const refreshToken = await this.refreshTokenService.getByToken(token);

    if (!refreshToken) {
      throw new UnauthorizedException(
        AUTH_API_EXCEPTIONS.REFRESH_TOKEN_INVALID,
      );
    }

    if (refreshToken.expiresAt < new Date() || refreshToken.invalidAt) {
      throw new UnauthorizedException(
        AUTH_API_EXCEPTIONS.REFRESH_TOKEN_EXPIRED,
      );
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

  async register(
    name: string,
    email: string,
    password: string,
    icon: UserIcon | undefined,
    birthDate: string,
  ): Promise<RegisterResponseDto> {
    if (await this.userService.verityUserExistsByEmail(email)) {
      throw new ConflictException('Email já está em uso');
    }

    const user = await this.userService.createUser(name, icon, birthDate);

    const credential = await this.userCredentialService.createUserCredential(
      user,
      email,
      password,
    );

    const verification =
      await this.emailVerificationService.createVerificationToken(credential);

    const verificationUrl = `${this.configService.getOrThrow('FRONTEND_URL')}/auth/verify-email?token=${verification.token}`;

    await this.emailService.sendVerificationEmail(
      credential.email,
      user.name,
      verificationUrl,
    );

    return { email: credential.email };
  }

  async verifyEmail(token: string): Promise<void> {
    const userCredential =
      await this.emailVerificationService.verifyToken(token);

    await this.emailService.sendWelcomeEmail(
      userCredential.email,
      userCredential.user.name,
    );
  }

  async resendVerificationEmail(email: string): Promise<void> {
    const user = await this.userService.getByEmail(email);

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    if (!user.credential) {
      return;
    }

    if (user.credential.emailVerified) {
      throw new BadRequestException('Email já está verificado');
    }

    const verification =
      await this.emailVerificationService.createVerificationToken(
        user.credential,
      );

    const verificationUrl = `${this.configService.getOrThrow('FRONTEND_URL')}/auth/verify-email?token=${verification.token}`;

    await this.emailService.sendVerificationEmail(
      email,
      user.name,
      verificationUrl,
    );

    return;
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userService.getByEmail(email);

    if (!user) {
      return;
    }

    if (user.credential) {
      const reset = await this.passwordResetService.createResetToken(
        user.credential,
      );

      const resetUrl = `${this.configService.getOrThrow('FRONTEND_URL')}/auth/reset-password?token=${reset.token}`;

      await this.emailService.sendPasswordResetEmail(
        email,
        user.name,
        resetUrl,
      );
    }

    return;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const reset = await this.passwordResetService.verifyToken(token);

    await this.userCredentialService.updatePassword(
      reset.userCredential,
      newPassword,
    );

    await this.passwordResetService.revokeAllResetTokens(reset.userCredential);
    await this.revokeAllRefreshTokens(reset.userCredential.user);

    return;
  }
}
