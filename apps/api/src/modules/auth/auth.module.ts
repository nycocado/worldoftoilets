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
  providers: [AuthService, JwtCookieStrategy],
  exports: [AuthService],
})
export class AuthModule {}
