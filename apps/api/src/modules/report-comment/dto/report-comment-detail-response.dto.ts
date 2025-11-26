import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CommentResponseDto } from '@modules/comment/dto';
import { ReportCommentResponseDto } from './report-comment-response.dto';

/**
 * DTO de resposta para detalhes de denúncias de um comentário.
 */
export class ReportCommentDetailResponseDto {
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
    description: 'Lista de todas as denúncias.',
    type: () => [ReportCommentResponseDto],
  })
  @Expose()
  @Type(() => ReportCommentResponseDto)
  reports: ReportCommentResponseDto[];

  @ApiProperty({
    description: 'Contagem de denúncias por tipo.',
    example: { spam: 5, 'offensive-content': 3 },
  })
  @Expose()
  reportsByType: Record<string, number>;
}
