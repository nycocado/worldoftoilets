import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtCookieStrategy } from './jwt-strategy.service';
import { UserModule } from '@modules/user';
import { RefreshTokenModule } from '@modules/refresh-token/refresh-token.module';
import { EmailVerificationModule } from '@modules/email-verification/email-verification.module';
import { PasswordResetModule } from '@modules/password-reset/password-reset.module';
import { UserCredentialModule } from '@modules/user-credential/user-credential.module';
import { EmailModule } from '@modules/email/email.module';
import { LoginUseCase } from '@modules/auth/use-cases';
import { RegisterUseCase } from '@modules/auth/use-cases';
import { RefreshTokenUseCase } from '@modules/auth/use-cases';
import { VerifyEmailUseCase } from '@modules/auth/use-cases';
import { ResendVerificationUseCase } from '@modules/auth/use-cases';
import { ForgotPasswordUseCase } from '@modules/auth/use-cases';
import { ResetPasswordUseCase } from '@modules/auth/use-cases';
import { LogoutUseCase } from '@modules/auth/use-cases';
import { LogoutAllUseCase } from '@modules/auth/use-cases';

/**
 * Módulo de Autenticação
 *
 * @module AuthModule
 * @description Organiza todos os componentes de autenticação e autorização do sistema.
 * Gerir o ciclo de vida completo da autenticação de utilizadores, incluindo:
 * - Login e registo de contas
 * - Verificação de email
 * - Gestão de tokens JWT (access e refresh)
 * - Recuperação e reset de passwords
 * - Estratégia de validação JWT via cookies/Bearer tokens
 *
 * @exports AuthService - Serviço principal de autenticação
 * @see AuthController - Controlador com endpoints de autenticação
 * @see JwtCookieStrategy - Estratégia Passport para validação JWT
 */
@Module({
  imports: [
    UserModule,
    RefreshTokenModule,
    PassportModule,
    EmailVerificationModule,
    PasswordResetModule,
    UserCredentialModule,
    EmailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow<string>('JWT_EXPIRATION') as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtCookieStrategy,
    LoginUseCase,
    RegisterUseCase,
    RefreshTokenUseCase,
    VerifyEmailUseCase,
    ResendVerificationUseCase,
    ForgotPasswordUseCase,
    ResetPasswordUseCase,
    LogoutUseCase,
    LogoutAllUseCase,
  ],
  exports: [AuthService],
})
export class AuthModule {}
