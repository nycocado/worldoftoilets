import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PartnerStatus } from '@database/entities';

/**
 * DTO para a resposta de uma candidatura de parceria.
 */
export class PartnerApplicationResponseDto {
  @ApiProperty({
    description: 'O ID público da candidatura.',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @Expose()
  publicId!: string;

  @ApiProperty({
    description: 'O status atual da candidatura.',
    enum: PartnerStatus,
    example: PartnerStatus.PENDING,
  })
  @Expose()
  status!: PartnerStatus;

  @ApiProperty({
    description: 'E-mail de contacto para a parceria.',
    example: 'contacto@estabelecimento.pt',
  })
  @Expose()
  contactEmail!: string;

  @ApiProperty({
    description: 'Data de criação da candidatura.',
    example: '2024-01-15T10:30:00.000Z',
  })
  @Expose()
  @Type(() => Date)
  createdAt!: Date;
}
