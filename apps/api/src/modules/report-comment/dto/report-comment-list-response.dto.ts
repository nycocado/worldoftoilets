import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  ReportCommentStatus,
  TypeReportCommentApiName,
} from '@database/entities';
import { CommentResponseDto } from '@modules/comment/dto';

/**
 * DTO de resposta para listagem de comentários denunciados.
 */
export class ReportCommentListResponseDto {
  @ApiProperty({
    description: 'Comentário denunciado.',
    type: () => CommentResponseDto,
  })
  @Expose()
  @Type(() => CommentResponseDto)
  comment: CommentResponseDto;

  @ApiProperty({ description: 'Total de denúncias.' })
  @Expose()
  totalReports: number;

  @ApiProperty({
    description: 'Tipo de denúncia mais frequente.',
    enum: TypeReportCommentApiName,
  })
  @Expose()
  mostFrequentType: TypeReportCommentApiName;

  @ApiProperty({ description: 'Data da denúncia mais recente.' })
  @Expose()
  @Type(() => Date)
  latestReportDate: Date;

  @ApiProperty({
    description: 'Status agregado da denúncia.',
    enum: ReportCommentStatus,
  })
  @Expose()
  status: ReportCommentStatus;
}
