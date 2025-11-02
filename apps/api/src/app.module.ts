import { Module, ValidationPipe } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule } from '@nestjs/config';
import { microOrmConfig } from '@config/mikroorm.config';
import { CommentModule } from '@modules/comment/comment.module';
import { HealthModule } from '@modules/health/health.module';
import { AuthModule } from '@modules/auth/auth.module';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { MikroOrmNotFoundInterceptor } from '@common/interceptors';
import { UserModule } from '@modules/user';
import { RefreshTokenModule } from '@modules/refresh-token';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MikroOrmModule.forRoot(microOrmConfig),
    CommentModule,
    HealthModule,
    AuthModule,
    UserModule,
    RefreshTokenModule,
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
  ],
})
export class AppModule {}
