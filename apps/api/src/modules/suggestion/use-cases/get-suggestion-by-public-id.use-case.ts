import { Injectable } from '@nestjs/common';
import { SuggestionService } from '@modules/suggestion/suggestion.service';
import { SuggestionResponseDto } from '@modules/suggestion/dto';
import { plainToInstance } from 'class-transformer';

/**
 * Contém a lógica de negócio para obter uma sugestão pelo seu ID público.
 */
@Injectable()
export class GetSuggestionByPublicIdUseCase {
  constructor(private readonly suggestionService: SuggestionService) {}

  /**
   * Executa a busca de uma sugestão pelo seu ID público.
   *
   * @param {string} publicId O ID público da sugestão.
   * @returns {Promise<SuggestionResponseDto>} O DTO da sugestão.
   */
  async execute(publicId: string): Promise<SuggestionResponseDto> {
    const suggestion =
      await this.suggestionService.getSuggestionByPublicId(publicId);

    return plainToInstance(SuggestionResponseDto, suggestion, {
      excludeExtraneousValues: true,
    });
  }
}
