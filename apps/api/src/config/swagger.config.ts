import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('WORLD OF TOILETS API')
  .setDescription('REST API for World of Toilets, a toilet map application.')
  .setVersion('1.0')
  .addCookieAuth('token')
  .build();
