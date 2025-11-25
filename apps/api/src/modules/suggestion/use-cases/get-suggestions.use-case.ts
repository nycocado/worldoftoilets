import { Injectable } from '@nestjs/common';
import { SuggestionRepository } from '@modules/suggestion/suggestion.repository';
import { SuggestionResponseDto } from '@modules/suggestion/dto';
import { plainToInstance } from 'class-transformer';
import { SuggestionStatus } from '@database/entities';

/**
 * Contém a lógica de negócio para obter sugestões.
 */
@Injectable()
export class GetSuggestionsUseCase {
  constructor(private readonly repository: SuggestionRepository) {}

  /**
   * Executa a busca de sugestões.
   *
   * @param {SuggestionStatus} [status] O estado da sugestão para filtrar.
   * @param {boolean} [pageable] Define se a paginação deve ser aplicada.
   * @param {number} [page] O número da página.
   * @param {number} [size] O tamanho da página.
   * @returns {Promise<SuggestionResponseDto[]>} A lista de DTOs de sugestão.
   */
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
