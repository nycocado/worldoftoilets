import { Injectable } from '@nestjs/common';
import { SuggestionService } from '@modules/suggestion/suggestion.service';
import { SuggestionResponseDto } from '@modules/suggestion/dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GetSuggestionByPublicIdUseCase {
  constructor(private readonly suggestionService: SuggestionService) {}

  async execute(publicId: string): Promise<SuggestionResponseDto> {
    const suggestion =
      await this.suggestionService.getSuggestionByPublicId(publicId);

    return plainToInstance(SuggestionResponseDto, suggestion, {
      excludeExtraneousValues: true,
    });
  }
}
