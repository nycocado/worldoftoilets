import { Injectable, NotFoundException } from '@nestjs/common';
import { SuggestionRepository } from '@modules/suggestion/suggestion.repository';
import { SUGGESTION_EXCEPTIONS } from '@modules/suggestion/constants/exceptions.constant';
import { SuggestionEntity } from '@database/entities';

@Injectable()
export class SuggestionService {
  constructor(private readonly repository: SuggestionRepository) {}

  async getSuggestionByPublicId(publicId: string): Promise<SuggestionEntity> {
    const suggestion = await this.repository.findByPublicId(publicId);
    if (!suggestion) {
      throw new NotFoundException(SUGGESTION_EXCEPTIONS.SUGGESTION_NOT_FOUND);
    }
    return suggestion;
  }
}
