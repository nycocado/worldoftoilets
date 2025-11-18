import { ConfigService } from '@nestjs/config';

export interface MinioConfig {
  endPoint: string;
  port: number;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
  bucket: string;
  publicUrl?: string;
}

export const createMinioConfig = (config: ConfigService): MinioConfig => {
  return {
    endPoint: config.getOrThrow('MINIO_ENDPOINT'),
    port: parseInt(config.getOrThrow('MINIO_PORT'), 10),
    useSSL: config.getOrThrow('MINIO_USE_SSL') === 'true',
    accessKey: config.getOrThrow('MINIO_ACCESS_KEY'),
    secretKey: config.getOrThrow('MINIO_SECRET_KEY'),
    bucket: config.getOrThrow('MINIO_BUCKET'),
    publicUrl: config.getOrThrow('MINIO_PUBLIC_URL'),
  };
};
