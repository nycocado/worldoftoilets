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

/**
 * Contém a lógica de negócio para as operações de armazenamento de objetos no Minio.
 */
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

  /**
   * Garante que o bucket exista no Minio ao iniciar o módulo.
   */
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

  /**
   * Faz upload de um arquivo para o Minio.
   *
   * @param {Buffer | Readable} file O conteúdo do arquivo.
   * @param {string} fileName O nome do arquivo no bucket.
   * @param {string} [contentType='application/octet-stream'] O tipo de conteúdo do arquivo.
   * @returns {Promise<string>} O nome do arquivo salvo.
   */
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

  /**
   * Retorna a URL pública de um arquivo.
   *
   * @param {string} fileName O nome do arquivo.
   * @returns {string} A URL pública do arquivo.
   */
  getPublicFileUrl(fileName: string): string {
    if (this.config.publicUrl) {
      return `${this.config.publicUrl}/${this.config.bucket}/${fileName}`;
    }
    return this.getInternalFileUrl(fileName);
  }

  /**
   * Retorna a URL interna de um arquivo.
   *
   * @param {string} fileName O nome do arquivo.
   * @returns {string} A URL interna do arquivo.
   */
  getInternalFileUrl(fileName: string): string {
    return `http${this.config.useSSL ? 's' : ''}://${this.config.endPoint}:${this.config.port}/${this.config.bucket}/${fileName}`;
  }

  /**
   * Deleta um arquivo do Minio.
   *
   * @param {string} fileName O nome do arquivo a ser deletado.
   * @returns {Promise<void>}
   */
  async deleteFile(fileName: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.config.bucket,
      Key: fileName,
    });

    await this.s3Client.send(command);
  }

  /**
   * Copia um arquivo de um local para outro dentro do mesmo bucket.
   *
   * @param {string} sourceFileName O nome do arquivo de origem.
   * @param {string} destFileName O nome do arquivo de destino.
   * @returns {Promise<void>}
   */
  async copyFile(sourceFileName: string, destFileName: string): Promise<void> {
    const command = new CopyObjectCommand({
      Bucket: this.config.bucket,
      CopySource: `${this.config.bucket}/${sourceFileName}`,
      Key: destFileName,
    });

    await this.s3Client.send(command);
  }

  /**
   * Obtém o conteúdo de um arquivo como um stream.
   *
   * @param {string} fileName O nome do arquivo.
   * @returns {Promise<Readable>} Um stream do conteúdo do arquivo.
   */
  async getFile(fileName: string): Promise<Readable> {
    const command = new GetObjectCommand({
      Bucket: this.config.bucket,
      Key: fileName,
    });

    const response = await this.s3Client.send(command);
    return response.Body as Readable;
  }

  /**
   * Lista os arquivos em um determinado diretório (prefixo).
   *
   * @param {string} [prefix] O prefixo do diretório a ser listado.
   * @returns {Promise<string[]>} Uma lista com os nomes dos arquivos.
   */
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
