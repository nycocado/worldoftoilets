import { Injectable } from '@nestjs/common';
import { SuggestionRepository } from '@modules/suggestion/suggestion.repository';
import { SuggestionResponseDto } from '@modules/suggestion/dto';
import { plainToInstance } from 'class-transformer';
import { SuggestionStatus } from '@database/entities';

@Injectable()
export class GetSuggestionsUseCase {
  constructor(private readonly repository: SuggestionRepository) {}

  async execute(
    status?: SuggestionStatus,
    pageable?: boolean,
    page?: number,
    size?: number,
  ): Promise<SuggestionResponseDto[]> {
    const suggestions = await this.repository.find(
      status,
      pageable,
      page,
      size,
    );

    return suggestions.map((suggestion) =>
      plainToInstance(SuggestionResponseDto, suggestion, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
