import { Expose, plainToInstance, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ReportCommentStatus } from '@database/entities';
import { TypeReportCommentResponseDto } from './type-report-comment-response.dto';
import { UserSuggestionResponseDto } from '@modules/user/dto';

/**
 * DTO de resposta para uma denúncia de comentário.
 */
export class ReportCommentResponseDto {
  @ApiProperty({ description: 'ID público da denúncia.' })
  @Expose()
  publicId: string;

  @ApiProperty({
    description: 'Tipo de denúncia.',
    type: () => TypeReportCommentResponseDto,
  })
  @Expose()
  @Type(() => TypeReportCommentResponseDto)
  typeReportComment: TypeReportCommentResponseDto;

  @ApiProperty({
    description: 'Status da denúncia.',
    enum: ReportCommentStatus,
  })
  @Expose()
  status: ReportCommentStatus;

  @ApiProperty({
    description: 'Usuário que reportou a denúncia.',
    type: () => UserSuggestionResponseDto,
  })
  @Expose()
  @Type(() => UserSuggestionResponseDto)
  @Transform(({ obj }) => {
    const react = obj.react || {};
    const user = react.user || {};
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
