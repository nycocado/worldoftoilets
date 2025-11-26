import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type, plainToInstance } from 'class-transformer';
import { ReportUserStatus } from 'src/database/entities/report-user.entity';
import { UserSuggestionResponseDto } from 'src/modules/user/dto';
import { TypeReportUserResponseDto } from './type-report-user-response.dto';

/**
 * DTO de resposta para uma denúncia de utilizador.
 */
export class ReportUserResponseDto {
  @ApiProperty({
    description: 'Identificador público da denúncia.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  publicId: string;

  @ApiProperty({
    description: 'Tipo de denúncia.',
    type: () => TypeReportUserResponseDto,
  })
  @Expose()
  @Type(() => TypeReportUserResponseDto)
  typeReportUser: TypeReportUserResponseDto;

  @ApiProperty({
    description: 'Utilizador que fez a denúncia.',
    type: () => UserSuggestionResponseDto,
  })
  @Expose()
  @Type(() => UserSuggestionResponseDto)
  @Transform(({ obj }) => {
    const user = obj.userReporter || {};
    return plainToInstance(UserSuggestionResponseDto, user, {
      excludeExtraneousValues: true,
    });
  })
  userReporter: UserSuggestionResponseDto;

  @ApiProperty({
    description: 'Utilizador denunciado.',
    type: () => UserSuggestionResponseDto,
  })
  @Expose()
  @Type(() => UserSuggestionResponseDto)
  @Transform(({ obj }) => {
    const user = obj.userReported || {};
    return plainToInstance(UserSuggestionResponseDto, user, {
      excludeExtraneousValues: true,
    });
  })
  userReported: UserSuggestionResponseDto;

  @ApiProperty({
    description: 'Status da denúncia.',
    enum: ReportUserStatus,
    example: ReportUserStatus.PENDING,
  })
  @Expose()
  status: ReportUserStatus;

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
