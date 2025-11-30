import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { PartnerStatus } from '@database/entities';
import { ToiletResponseDto } from '@modules/toilet/dto';
import { buildMinioFileUrl } from '@common/utils';

/**
 * DTO para a resposta com informações da própria parceria (após aprovação).
 */
export class PartnerSelfResponseDto {
  @ApiProperty({
    description: 'O ID público da parceria.',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @Expose()
  publicId!: string;

  @ApiProperty({
    description: 'A casa de banho representada pela parceria.',
    type: () => ToiletResponseDto,
  })
  @Expose()
  @Type(() => ToiletResponseDto)
  toilet!: ToiletResponseDto;

  @ApiProperty({
    description: 'O documento de certificação (URL).',
    example: 'https://storage.example.com/certificates/abc123.pdf',
  })
  @Expose()
  @Transform(({ obj }) => buildMinioFileUrl(obj.certificate))
  certificate!: string;

  @ApiProperty({
    description: 'E-mail de contacto para a parceria.',
    example: 'contacto@estabelecimento.pt',
  })
  @Expose()
  contactEmail!: string;

  @ApiProperty({
    description: 'O status atual da parceria.',
    enum: PartnerStatus,
    example: PartnerStatus.ACTIVE,
  })
  @Expose()
  status!: PartnerStatus;

  @ApiProperty({
    description: 'Data de criação da parceria.',
    example: '2024-01-15T10:30:00.000Z',
  })
  @Expose()
  @Type(() => Date)
  createdAt!: Date;

  @ApiProperty({
    description: 'Data de revisão da candidatura.',
    example: '2024-01-20T14:00:00.000Z',
    nullable: true,
  })
  @Expose()
  @Type(() => Date)
  reviewedAt?: Date;
}
