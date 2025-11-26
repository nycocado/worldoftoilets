import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type, plainToInstance } from 'class-transformer';
import { UserSuggestionResponseDto } from 'src/modules/user/dto';
import { ReportUserResponseDto } from './report-user-response.dto';

/**
 * DTO de resposta para detalhes completos de denúncias de um utilizador.
 */
export class ReportUserDetailResponseDto {
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

  @ApiProperty({ description: 'Total de denúncias.' })
  @Expose()
  totalReports: number;

  @ApiProperty({
    description: 'Lista de todas as denúncias.',
    type: () => [ReportUserResponseDto],
  })
  @Expose()
  @Type(() => ReportUserResponseDto)
  reports: ReportUserResponseDto[];

  @ApiProperty({
    description: 'Contagem de denúncias por tipo.',
    example: { 'harassment-abuse': 5, 'fake-account': 3 },
  })
  @Expose()
  reportsByType: Record<string, number>;
}
