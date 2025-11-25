import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  HeadBucketCommand,
  CreateBucketCommand,
  PutBucketPolicyCommand,
  CopyObjectCommand,
} from '@aws-sdk/client-s3';
import { createMinioConfig, MinioConfig } from '@config/minio.config';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly s3Client: S3Client;
  private readonly config: MinioConfig;

  constructor(private readonly configService: ConfigService) {
    this.config = createMinioConfig(this.configService);

    this.s3Client = new S3Client({
      endpoint: `http${this.config.useSSL ? 's' : ''}://${this.config.endPoint}:${this.config.port}`,
      region: 'us-east-1',
      credentials: {
        accessKeyId: this.config.accessKey,
        secretAccessKey: this.config.secretKey,
      },
      forcePathStyle: true,
    });
  }

  async onModuleInit() {
    await this.ensureBucketExists();
  }

  private async ensureBucketExists(): Promise<void> {
    try {
      await this.s3Client.send(
        new HeadBucketCommand({ Bucket: this.config.bucket }),
      );
    } catch (error) {
      if (error.name === 'NotFound') {
        await this.s3Client.send(
          new CreateBucketCommand({ Bucket: this.config.bucket }),
        );
        await this.setBucketPublicPolicy();
      } else {
        throw error;
      }
    }
  }

  private async setBucketPublicPolicy(): Promise<void> {
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicReadGetObject',
          Effect: 'Allow',
          Principal: '*',
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${this.config.bucket}/*`],
        },
      ],
    };

    await this.s3Client.send(
      new PutBucketPolicyCommand({
        Bucket: this.config.bucket,
        Policy: JSON.stringify(policy),
      }),
    );
  }

  async uploadFile(
    file: Buffer | Readable,
    fileName: string,
    contentType: string = 'application/octet-stream',
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.config.bucket,
      Key: fileName,
      Body: file,
      ContentType: contentType,
    });

    await this.s3Client.send(command);
    return fileName;
  }

  getPublicFileUrl(fileName: string): string {
    if (this.config.publicUrl) {
      return `${this.config.publicUrl}/${this.config.bucket}/${fileName}`;
    }
    return this.getInternalFileUrl(fileName);
  }

  getInternalFileUrl(fileName: string): string {
    return `http${this.config.useSSL ? 's' : ''}://${this.config.endPoint}:${this.config.port}/${this.config.bucket}/${fileName}`;
  }

  async deleteFile(fileName: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.config.bucket,
      Key: fileName,
    });

    await this.s3Client.send(command);
  }

  async copyFile(sourceFileName: string, destFileName: string): Promise<void> {
    const command = new CopyObjectCommand({
      Bucket: this.config.bucket,
      CopySource: `${this.config.bucket}/${sourceFileName}`,
      Key: destFileName,
    });

    await this.s3Client.send(command);
  }

  async getFile(fileName: string): Promise<Readable> {
    const command = new GetObjectCommand({
      Bucket: this.config.bucket,
      Key: fileName,
    });

    const response = await this.s3Client.send(command);
    return response.Body as Readable;
  }

  async listFiles(prefix?: string): Promise<string[]> {
    const command = new ListObjectsV2Command({
      Bucket: this.config.bucket,
      Prefix: prefix,
    });

    const response = await this.s3Client.send(command);
    return (
      response.Contents?.map((obj) => obj.Key).filter((key): key is string =>
        Boolean(key),
      ) || []
    );
  }

  /**
   * Gera um nome de arquivo único no MinIO, evitando colisões.
   *
   * @param {string} folder - Nome da pasta (ex: 'toilets', 'suggestions', 'partner-certificates').
   * @param {string} extension - A extensão do arquivo (ex: 'jpg', 'png', 'pdf').
   * @returns {Promise<string>} O nome único do arquivo (ex: 'toilets/uuid.jpg').
   *
   * @description
   * Tenta gerar um nome de arquivo único usando UUID.
   * Se após 5 tentativas ainda houver colisão, adiciona timestamp ao nome.
   */
  async generateUniqueFileName(
    folder: string,
    extension: string,
  ): Promise<string> {
    const maxAttempts = 5;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const fileName = `${folder}/${uuidv4()}.${extension}`;

      const exists = await this.fileExists(fileName);
      if (!exists) {
        return fileName;
      }

      attempts++;
    }

    return `${folder}/${Date.now()}-${uuidv4()}.${extension}`;
  }

  /**
   * Verifica se um arquivo existe no MinIO.
   *
   * @param {string} fileName - O nome do arquivo a verificar.
   * @returns {Promise<boolean>} `true` se o arquivo existir, `false` caso contrário.
   */
  async fileExists(fileName: string): Promise<boolean> {
    try {
      await this.getFile(fileName);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Extrai o nome do arquivo (caminho do objeto no MinIO) a partir de uma URL pública.
   *
   * @param {string} url - A URL pública da imagem.
   * @param {string} folder - Nome da pasta (ex: 'toilets', 'suggestions').
   * @returns {string | null} O nome do arquivo (ex: 'toilets/uuid.jpg') ou `null` se a extração falhar.
   *
   * @description
   * Analisa a URL e extrai o caminho relativo do arquivo dentro do bucket.
   * Útil para obter o nome do arquivo a partir de URLs públicas antes de deletar/copiar.
   *
   * @example
   * const url = 'http://localhost/files/wot/toilets/uuid.jpg';
   * const fileName = minioService.extractFileNameFromUrl(url, 'toilets');
   * // Retorna: 'toilets/uuid.jpg'
   */
  extractFileNameFromUrl(url: string, folder: string): string | null {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);

      const folderIndex = pathParts.indexOf(folder);
      if (folderIndex !== -1 && folderIndex < pathParts.length - 1) {
        return pathParts.slice(folderIndex).join('/');
      }

      return null;
    } catch {
      return null;
    }
  }
}
