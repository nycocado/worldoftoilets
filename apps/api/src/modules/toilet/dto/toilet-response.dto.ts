import { Expose, plainToInstance, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AccessResponseDto } from '@modules/toilet/dto/access-response.dto';
import { TypeExtraResponseDto } from '@modules/toilet/dto/type-extra-response.dto';
import { CommentRateToiletResponseDto } from '@modules/comment-rate/dto';

/**
 * DTO para a resposta com os dados de uma casa de banho.
 */
export class ToiletResponseDto {
  @ApiProperty({
    description: 'O ID público da casa de banho.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Expose()
  publicId!: string;

  @ApiProperty({
    description: 'O tipo de acesso da casa de banho.',
    type: () => AccessResponseDto,
  })
  @Expose()
  @Type(() => AccessResponseDto)
  access!: AccessResponseDto;

  @ApiProperty({
    description: 'A lista de recursos extra disponíveis.',
    type: () => [TypeExtraResponseDto],
  })
  @Expose()
  @Transform(({ obj }) => {
    const items = obj.extras ?? [];
    return items.map((e: any) =>
      plainToInstance(TypeExtraResponseDto, e, {
        excludeExtraneousValues: true,
      }),
    );
  })
  extras: Array<TypeExtraResponseDto>;

  @ApiProperty({
    description: 'O nome da casa de banho.',
    example: 'Casa de Banho Central',
  })
  @Expose()
  name!: string;

  @ApiProperty({
    description: 'A latitude da localização.',
    example: 38.7223,
  })
  @Expose()
  latitude!: number;

  @ApiProperty({
    description: 'A longitude da localização.',
    example: -9.1393,
  })
  @Expose()
  longitude!: number;

  @ApiProperty({
    description: 'A morada completa.',
    example: 'Praça do Comércio, 1',
  })
  @Expose()
  address!: string;

  @ApiProperty({
    description: 'A cidade.',
    example: 'Lisboa',
  })
  @Expose()
  city!: string;

  @ApiProperty({
    description: 'O estado ou província.',
    required: false,
    example: 'Lisboa',
  })
  @Expose()
  state?: string;

  @ApiProperty({
    description: 'O país.',
    example: 'Portugal',
  })
  @Expose()
  country!: string;

  @ApiProperty({
    description: 'O código ISO do país.',
    example: 'PT',
  })
  @Expose()
  countryCode!: string;

  @ApiProperty({
    description: 'O URL da foto da casa de banho.',
    example: 'https://api.example.com/files/toilets/uuid.jpg',
  })
  @Expose()
  photoUrl!: string;

  @ApiProperty({
    description: 'O ID do Google Places.',
    example: 'ChIJa2s3kTIzGQ0RUIedOPb0Og0',
  })
  @Expose()
  placeId!: string;

  @ApiProperty({
    description: 'As estatísticas de avaliação da casa de banho.',
    type: () => CommentRateToiletResponseDto,
  })
  @Expose()
  @Transform(({ obj }) => ({
    totalRatings: obj.totalRatings ?? 0,
    avgClean: obj.avgClean ?? 0,
    avgStructure: obj.avgStructure ?? 0,
    avgAccessibility: obj.avgAccessibility ?? 0,
    paperAvailability: obj.paperAvailability ?? 0,
  }))
  rating: CommentRateToiletResponseDto;
}
