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
} from '@aws-sdk/client-s3';
import { createMinioConfig, MinioConfig } from '@config/minio.config';
import { Readable } from 'stream';

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

  async uploadImage(
    file: Buffer | Readable,
    fileName: string,
    contentType: string = 'image/jpeg',
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

  getPublicImageUrl(fileName: string): string {
    if (this.config.publicUrl) {
      return `${this.config.publicUrl}/${fileName}`;
    }
    return this.getInternalImageUrl(fileName);
  }

  getInternalImageUrl(fileName: string): string {
    return `http${this.config.useSSL ? 's' : ''}://${this.config.endPoint}:${this.config.port}/${this.config.bucket}/${fileName}`;
  }

  async deleteImage(fileName: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.config.bucket,
      Key: fileName,
    });

    await this.s3Client.send(command);
  }

  async getImage(fileName: string): Promise<Readable> {
    const command = new GetObjectCommand({
      Bucket: this.config.bucket,
      Key: fileName,
    });

    const response = await this.s3Client.send(command);
    return response.Body as Readable;
  }

  async listImages(prefix?: string): Promise<string[]> {
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
}
