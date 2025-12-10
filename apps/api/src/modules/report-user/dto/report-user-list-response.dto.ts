import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type, plainToInstance } from 'class-transformer';
import { UserSuggestionResponseDto } from 'src/modules/user/dto';
import { ReportUserStatus } from '@database/entities';

/**
 * DTO de resposta para item da lista de utilizadores denunciados.
 */
export class ReportUserListResponseDto {
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
    description: 'Total de denúncias.',
    example: 5,
  })
  @Expose()
  totalReports: number;

  @ApiProperty({
    description: 'Tipo de denúncia mais frequente.',
    example: 'harassment-abuse',
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
    enum: ReportUserStatus,
  })
  @Expose()
  status: ReportUserStatus;
}
