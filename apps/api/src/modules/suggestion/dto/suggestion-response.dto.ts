import { Expose, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { SuggestionStatus } from '@database/entities';
import { UserSuggestionResponseDto } from '@modules/user/dto';
import { ToiletResponseDto } from '@modules/toilet/dto';
import { buildMinioFileUrl } from '@common/utils';

/**
 * DTO para a resposta de uma sugestão.
 */
export class SuggestionResponseDto {
  @ApiProperty({ description: 'O ID público da sugestão.' })
  @Expose()
  publicId!: string;

  @ApiProperty({ description: 'A latitude da sugestão.' })
  @Expose()
  latitude: number;

  @ApiProperty({ description: 'A longitude da sugestão.' })
  @Expose()
  longitude: number;

  @ApiProperty({
    description: 'O URL da foto da sugestão.',
    required: false,
  })
  @Expose()
  @Transform(({ obj }) => buildMinioFileUrl(obj.photoUrl))
  photoUrl?: string;

  @ApiProperty({ description: 'O estado da sugestão.', enum: SuggestionStatus })
  @Expose()
  status!: SuggestionStatus;

  @ApiProperty({
    description: 'O utilizador que fez a sugestão.',
    type: () => UserSuggestionResponseDto,
  })
  @Expose()
  @Type(() => UserSuggestionResponseDto)
  user!: UserSuggestionResponseDto;

  @ApiProperty({
    description: 'A casa de banho sugerida.',
    type: () => ToiletResponseDto,
  })
  @Expose()
  @Type(() => ToiletResponseDto)
  toilet!: ToiletResponseDto;

  @ApiProperty({
    description: 'A data em que a sugestão foi revista.',
    required: false,
  })
  @Expose()
  reviewedAt?: Date;

  @ApiProperty({ description: 'A data de criação da sugestão.' })
  @Expose()
  createdAt!: Date;
}
