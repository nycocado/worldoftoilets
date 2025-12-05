import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { swaggerConfig } from '@config/swagger.config';
import { doubleCsrfProtection } from '@config/csrf.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  app.use(cookieParser());

  app.use(doubleCsrfProtection);

  app.enableCors({
    origin: process.env.CORS_ORIGIN || true,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
