import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { SuggestionStatus } from '@database/entities';

/**
 * DTO para a requisição de listagem de sugestões.
 */
export class GetSuggestionsRequestDto {
  @ApiProperty({
    description: 'Define se a paginação deve ser aplicada.',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  pageable?: boolean;

  @ApiProperty({
    description: 'O número da página a ser retornada.',
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 0;

  @ApiProperty({
    description: 'O número de itens por página.',
    required: false,
    default: 20,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  size?: number = 20;

  @ApiProperty({
    description: 'Filtra as sugestões pelo seu estado.',
    required: false,
    enum: SuggestionStatus,
  })
  @IsOptional()
  @IsEnum(SuggestionStatus)
  status?: SuggestionStatus;
}
