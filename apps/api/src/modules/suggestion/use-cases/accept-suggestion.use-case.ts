import { Injectable, ConflictException } from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { SuggestionService } from '@modules/suggestion/suggestion.service';
import { SuggestionRepository } from '@modules/suggestion/suggestion.repository';
import { SuggestionResponseDto } from '@modules/suggestion/dto';
import { UserService } from '@modules/user';
import { ToiletService } from '@modules/toilet';
import { SuggestionStatus, ToiletStatus } from '@database/entities';
import { SUGGESTION_EXCEPTIONS } from '@modules/suggestion/constants/exceptions.constant';
import { plainToInstance } from 'class-transformer';

/**
 * Contém a lógica de negócio para aceitar uma sugestão.
 */
@Injectable()
export class AcceptSuggestionUseCase {
  constructor(
    private readonly repository: SuggestionRepository,
    private readonly suggestionService: SuggestionService,
    private readonly userService: UserService,
    private readonly toiletService: ToiletService,
  ) {}

  /**
   * Aceita uma sugestão e ativa a casa de banho correspondente.
   *
   * @param {string} suggestionPublicId O ID público da sugestão.
   * @param {string} reviewerPublicId O ID público do revisor.
   * @returns {Promise<SuggestionResponseDto>} A sugestão aceite.
   * @throws {ConflictException} Se a sugestão não estiver pendente.
   */
  @Transactional()
  async execute(
    suggestionPublicId: string,
    reviewerPublicId: string,
  ): Promise<SuggestionResponseDto> {
    const suggestion =
      await this.suggestionService.getSuggestionByPublicId(suggestionPublicId);

    if (suggestion.status !== SuggestionStatus.PENDING) {
      throw new ConflictException(SUGGESTION_EXCEPTIONS.SUGGESTION_NOT_PENDING);
    }

    const reviewer = await this.userService.getUserByPublicId(reviewerPublicId);

    await this.repository.acceptSuggestion(suggestion, reviewer);

    const toilet = suggestion.interaction.toilet;
    await this.toiletService.changeToiletStatus(toilet, ToiletStatus.ACTIVE);

    return plainToInstance(SuggestionResponseDto, suggestion, {
      excludeExtraneousValues: true,
    });
  }
}
