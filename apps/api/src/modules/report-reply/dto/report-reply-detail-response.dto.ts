import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type, plainToInstance } from 'class-transformer';
import { ReplyResponseDto } from 'src/modules/reply/dto';
import { ReportReplyResponseDto } from './report-reply-response.dto';

/**
 * DTO de resposta para detalhes completos de denúncias de uma resposta.
 */
export class ReportReplyDetailResponseDto {
  @ApiProperty({
    description: 'Resposta denunciada.',
    type: () => ReplyResponseDto,
  })
  @Expose()
  @Type(() => ReplyResponseDto)
  @Transform(({ obj }) => {
    const reply = obj.reply || {};
    return plainToInstance(ReplyResponseDto, reply, {
      excludeExtraneousValues: true,
    });
  })
  reply: ReplyResponseDto;

  @ApiProperty({ description: 'Total de denúncias.' })
  @Expose()
  totalReports: number;

  @ApiProperty({
    description: 'Lista de todas as denúncias.',
    type: () => [ReportReplyResponseDto],
  })
  @Expose()
  @Type(() => ReportReplyResponseDto)
  reports: ReportReplyResponseDto[];

  @ApiProperty({
    description: 'Contagem de denúncias por tipo.',
    example: { 'inappropriate-content': 5, spam: 3 },
  })
  @Expose()
  reportsByType: Record<string, number>;
}
