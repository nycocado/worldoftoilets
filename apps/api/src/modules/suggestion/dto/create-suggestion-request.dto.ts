import { IsLatitude, IsLongitude, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ToiletSuggestionRequestDto } from '@modules/suggestion/dto/toilet-suggestion-request.dto';

/**
 * DTO para a criação de uma nova sugestão.
 */
export class CreateSuggestionRequestDto {
  @ApiProperty({ description: 'A latitude do utilizador que faz a sugestão.' })
  @IsLatitude()
  @IsNotEmpty()
  @Type(() => Number)
  latitude!: number;

  @ApiProperty({
    description: 'A longitude do utilizador que faz a sugestão.',
  })
  @IsLongitude()
  @IsNotEmpty()
  @Type(() => Number)
  longitude!: number;

  @ApiProperty({
    description: 'Os detalhes da casa de banho sugerida.',
    type: () => ToiletSuggestionRequestDto,
  })
  @IsNotEmpty()
  @Type(() => ToiletSuggestionRequestDto)
  toilet: ToiletSuggestionRequestDto;
}
