import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MinioService } from './minio.service';

/**
 * Gerencia a funcionalidade de Minio (armazenamento de objetos), agrupando seus componentes.
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [MinioService],
  exports: [MinioService],
})
export class MinioModule {}
