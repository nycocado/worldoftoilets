import { Injectable, ConflictException } from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { SuggestionService } from '@modules/suggestion/suggestion.service';
import { SuggestionRepository } from '@modules/suggestion/suggestion.repository';
import { SuggestionResponseDto } from '@modules/suggestion/dto';
import { ToiletService } from '@modules/toilet';
import { SuggestionStatus, ToiletStatus } from '@database/entities';
import { SUGGESTION_EXCEPTIONS } from '@modules/suggestion/constants/exceptions.constant';
import { plainToInstance } from 'class-transformer';

/**
 * Contém a lógica de negócio para definir uma sugestão como pendente.
 */
@Injectable()
export class SetPendingSuggestionUseCase {
  constructor(
    private readonly repository: SuggestionRepository,
    private readonly suggestionService: SuggestionService,
    private readonly toiletService: ToiletService,
  ) {}

  /**
   * Define uma sugestão como pendente.
   *
   * @param {string} suggestionPublicId O ID público da sugestão.
   * @returns {Promise<SuggestionResponseDto>} A sugestão atualizada.
   * @throws {ConflictException} Se a sugestão já estiver pendente.
   */
  @Transactional()
  async execute(suggestionPublicId: string): Promise<SuggestionResponseDto> {
    const suggestion =
      await this.suggestionService.getSuggestionByPublicId(suggestionPublicId);

    if (suggestion.status === SuggestionStatus.PENDING) {
      throw new ConflictException(
        SUGGESTION_EXCEPTIONS.SUGGESTION_ALREADY_PENDING,
      );
    }

    await this.repository.setPending(suggestion);

    const toilet = suggestion.interaction.toilet;
    await this.toiletService.changeToiletStatus(toilet, ToiletStatus.SUGGESTED);

    return plainToInstance(SuggestionResponseDto, suggestion, {
      excludeExtraneousValues: true,
    });
  }
}
