import { Module, ValidationPipe } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createMikroOrmConfig } from '@config/mikroorm.config';
import { CommentModule } from '@modules/comment/comment.module';
import { HealthModule } from '@modules/health/health.module';
import { AuthModule } from '@modules/auth/auth.module';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { MikroOrmNotFoundInterceptor } from '@common/interceptors';
import { UserModule } from '@modules/user';
import { RefreshTokenModule } from '@modules/refresh-token';
import { EmailModule } from '@modules/email/email.module';
import { MariaDbDriver } from '@mikro-orm/mariadb';
import { EmailVerificationModule } from '@modules/email-verification/email-verification.module';
import { UserCredentialModule } from '@modules/user-credential/user-credential.module';
import { PasswordResetModule } from '@modules/password-reset/password-reset.module';
import { ResponseInterceptor } from '@common/interceptors/response.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MikroOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => createMikroOrmConfig(config),
      imports: [ConfigModule],
      inject: [ConfigService],
      driver: MariaDbDriver,
    }),
    CommentModule,
    HealthModule,
    AuthModule,
    UserModule,
    RefreshTokenModule,
    EmailModule,
    EmailVerificationModule,
    UserCredentialModule,
    PasswordResetModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () => new ValidationPipe({ transform: true }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: MikroOrmNotFoundInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
