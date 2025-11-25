import { Injectable } from '@nestjs/common';
import { SuggestionRepository } from '@modules/suggestion/suggestion.repository';
import { SuggestionResponseDto } from '@modules/suggestion/dto';
import { plainToInstance } from 'class-transformer';
import { SuggestionStatus } from '@database/entities';

/**
 * Contém a lógica de negócio para obter as sugestões de um utilizador.
 */
@Injectable()
export class GetSuggestionsByUserUseCase {
  constructor(private readonly repository: SuggestionRepository) {}

  /**
   * Executa a busca de sugestões por utilizador.
   *
   * @param {string} userPublicId O ID público do utilizador.
   * @param {SuggestionStatus} [status] O estado da sugestão para filtrar.
   * @param {boolean} [pageable] Define se a paginação deve ser aplicada.
   * @param {number} [page] O número da página.
   * @param {number} [size] O tamanho da página.
   * @returns {Promise<SuggestionResponseDto[]>} A lista de DTOs de sugestão.
   */
  async execute(
    userPublicId: string,
    status?: SuggestionStatus,
    pageable?: boolean,
    page?: number,
    size?: number,
  ): Promise<SuggestionResponseDto[]> {
    const suggestions = await this.repository.findByUser(
      userPublicId,
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
