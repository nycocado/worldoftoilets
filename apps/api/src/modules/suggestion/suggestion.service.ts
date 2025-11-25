import { Injectable, NotFoundException } from '@nestjs/common';
import { SuggestionRepository } from '@modules/suggestion/suggestion.repository';
import { SUGGESTION_EXCEPTIONS } from '@modules/suggestion/constants/exceptions.constant';
import { SuggestionEntity } from '@database/entities';

/**
 * Contém a lógica de negócio para as operações de sugestões.
 */
@Injectable()
export class SuggestionService {
  constructor(private readonly repository: SuggestionRepository) {}

  /**
   * Busca uma sugestão pelo seu ID público.
   *
   * @param {string} publicId O ID público da sugestão.
   * @returns {Promise<SuggestionEntity>} A entidade da sugestão encontrada.
   * @throws {NotFoundException} Se a sugestão não for encontrada.
   */
  async getSuggestionByPublicId(publicId: string): Promise<SuggestionEntity> {
    const suggestion = await this.repository.findByPublicId(publicId);
    if (!suggestion) {
      throw new NotFoundException(SUGGESTION_EXCEPTIONS.SUGGESTION_NOT_FOUND);
    }
    return suggestion;
  }
}
