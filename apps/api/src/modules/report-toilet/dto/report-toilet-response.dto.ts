import { Expose, plainToInstance, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ReportToiletStatus } from '@database/entities';
import { TypeReportToiletResponseDto } from '@modules/report-toilet';
import { UserSuggestionResponseDto } from '@modules/user/dto';

/**
 * DTO de resposta para uma denúncia de casa de banho.
 */
export class ReportToiletResponseDto {
  @ApiProperty({ description: 'ID público da denúncia.' })
  @Expose()
  publicId: string;

  @ApiProperty({
    description: 'Tipo de denúncia.',
    type: () => TypeReportToiletResponseDto,
  })
  @Expose()
  @Type(() => TypeReportToiletResponseDto)
  typeReportToilet: TypeReportToiletResponseDto;

  @ApiProperty({
    description: 'Status da denúncia.',
    enum: ReportToiletStatus,
  })
  @Expose()
  status: ReportToiletStatus;

  @ApiProperty({
    description: 'Usuário que reportou a denúncia.',
    type: () => UserSuggestionResponseDto,
  })
  @Expose()
  @Type(() => UserSuggestionResponseDto)
  @Transform(({ obj }) => {
    const interaction = obj.interaction || {};
    const user = interaction.user || {};
    return plainToInstance(UserSuggestionResponseDto, user, {
      excludeExtraneousValues: true,
    });
  })
  user: UserSuggestionResponseDto;

  @ApiProperty({ description: 'Data de criação da denúncia.' })
  @Expose()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    description: 'Data de revisão da denúncia.',
    required: false,
  })
  @Expose()
  @Type(() => Date)
  reviewedAt?: Date;

  @ApiProperty({
    description: 'ID público do revisor.',
    required: false,
  })
  @Expose()
  @Type(() => UserSuggestionResponseDto)
  reviewedBy?: UserSuggestionResponseDto;
}
