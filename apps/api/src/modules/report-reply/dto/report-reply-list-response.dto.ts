import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type, plainToInstance } from 'class-transformer';
import { ReplyResponseDto } from 'src/modules/reply/dto';
import { ReportReplyStatus } from '@database/entities';

/**
 * DTO de resposta para item da lista de respostas denunciadas.
 */
export class ReportReplyListResponseDto {
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

  @ApiProperty({
    description: 'Total de denúncias.',
    example: 5,
  })
  @Expose()
  totalReports: number;

  @ApiProperty({
    description: 'Tipo de denúncia mais frequente.',
    example: 'inappropriate-content',
  })
  @Expose()
  mostFrequentType: string;

  @ApiProperty({
    description: 'Data da denúncia mais recente.',
    type: String,
    format: 'date-time',
    example: '2024-01-15T10:30:00Z',
  })
  @Expose()
  latestReportDate: Date;

  @ApiProperty({
    description: 'Status agregado da denúncia.',
    enum: ReportReplyStatus,
  })
  @Expose()
  status: ReportReplyStatus;
}
