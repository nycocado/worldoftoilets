import { IsLatitude, IsLongitude, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ToiletSuggestionRequestDto } from '@modules/suggestion/dto/toilet-suggestion-request.dto';

export class CreateSuggestionRequestDto {
  @ApiProperty()
  @IsLatitude()
  @IsNotEmpty()
  @Type(() => Number)
  latitude!: number;

  @ApiProperty()
  @IsLongitude()
  @IsNotEmpty()
  @Type(() => Number)
  longitude!: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => ToiletSuggestionRequestDto)
  toilet: ToiletSuggestionRequestDto;
}
