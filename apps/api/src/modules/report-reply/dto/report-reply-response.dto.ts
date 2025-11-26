import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type, plainToInstance } from 'class-transformer';
import { ReportReplyStatus } from 'src/database/entities/report-reply.entity';
import { UserSuggestionResponseDto } from 'src/modules/user/dto';
import { TypeReportReplyResponseDto } from './type-report-reply-response.dto';

/**
 * DTO de resposta para uma denúncia de resposta.
 */
export class ReportReplyResponseDto {
  @ApiProperty({
    description: 'Identificador público da denúncia.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  publicId: string;

  @ApiProperty({
    description: 'Tipo de denúncia.',
    type: () => TypeReportReplyResponseDto,
  })
  @Expose()
  @Type(() => TypeReportReplyResponseDto)
  typeReportReply: TypeReportReplyResponseDto;

  @ApiProperty({
    description: 'Utilizador que fez a denúncia.',
    type: () => UserSuggestionResponseDto,
  })
  @Expose()
  @Type(() => UserSuggestionResponseDto)
  @Transform(({ obj }) => {
    const user = obj.user || {};
    return plainToInstance(UserSuggestionResponseDto, user, {
      excludeExtraneousValues: true,
    });
  })
  user: UserSuggestionResponseDto;

  @ApiProperty({
    description: 'Status da denúncia.',
    enum: ReportReplyStatus,
    example: ReportReplyStatus.PENDING,
  })
  @Expose()
  status: ReportReplyStatus;

  @ApiPropertyOptional({
    description: 'Administrador que reviu a denúncia.',
    type: () => UserSuggestionResponseDto,
    nullable: true,
  })
  @Expose()
  @Type(() => UserSuggestionResponseDto)
  @Transform(({ obj }) => {
    if (!obj.reviewedBy) return null;
    return plainToInstance(UserSuggestionResponseDto, obj.reviewedBy, {
      excludeExtraneousValues: true,
    });
  })
  reviewedBy: UserSuggestionResponseDto | null;

  @ApiPropertyOptional({
    description: 'Data e hora em que a denúncia foi revista.',
    type: String,
    format: 'date-time',
    example: '2024-01-15T10:30:00Z',
    nullable: true,
  })
  @Expose()
  reviewedAt: Date | null;

  @ApiProperty({
    description: 'Data e hora de criação da denúncia.',
    type: String,
    format: 'date-time',
    example: '2024-01-15T08:00:00Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Data e hora da última atualização.',
    type: String,
    format: 'date-time',
    example: '2024-01-15T10:30:00Z',
  })
  @Expose()
  updatedAt: Date;
}
