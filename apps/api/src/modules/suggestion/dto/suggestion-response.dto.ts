import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { SuggestionStatus } from '@database/entities';
import { UserSuggestionResponseDto } from '@modules/user/dto';
import { ToiletResponseDto } from '@modules/toilet/dto';

export class SuggestionResponseDto {
  @ApiProperty()
  @Expose()
  publicId!: string;

  @ApiProperty()
  @Expose()
  latitude: number;

  @ApiProperty()
  @Expose()
  longitude: number;

  @ApiProperty({ required: false })
  @Expose()
  photoUrl?: string;

  @ApiProperty({ enum: SuggestionStatus })
  @Expose()
  status!: SuggestionStatus;

  @ApiProperty()
  @Expose()
  @Type(() => UserSuggestionResponseDto)
  user!: UserSuggestionResponseDto;

  @ApiProperty({ type: ToiletResponseDto })
  @Expose()
  @Type(() => ToiletResponseDto)
  toilet!: ToiletResponseDto;

  @ApiProperty({ required: false })
  @Expose()
  reviewedAt?: Date;

  @ApiProperty()
  @Expose()
  createdAt!: Date;
}
