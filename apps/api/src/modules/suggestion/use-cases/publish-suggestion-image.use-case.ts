import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { SuggestionService } from '@modules/suggestion/suggestion.service';
import { ToiletService } from '@modules/toilet/toilet.service';
import { MinioService } from '@modules/minio';
import { SUGGESTION_EXCEPTIONS } from '@modules/suggestion/constants/exceptions.constant';
import { SuggestionResponseDto } from '@modules/suggestion/dto';
import { SuggestionStatus, ToiletStatus } from '@database/entities';
import { plainToInstance } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';

/**
 * Contém a lógica de negócio para publicar a imagem de uma sugestão.
 */
@Injectable()
export class PublishSuggestionImageUseCase {
  constructor(
    private readonly suggestionService: SuggestionService,
    private readonly toiletService: ToiletService,
    private readonly minioService: MinioService,
  ) {}

  /**
   * Publica a imagem de uma sugestão aceite, associando-a à casa de banho correspondente.
   *
   * @param {string} suggestionPublicId O ID público da sugestão.
   * @returns {Promise<SuggestionResponseDto>} O DTO da sugestão com a imagem publicada.
   * @throws {NotFoundException} Se a sugestão não for encontrada ou não tiver imagem.
   * @throws {ConflictException} Se a sugestão não estiver aceite ou a casa de banho não estiver ativa.
   */
  @Transactional()
  async execute(suggestionPublicId: string): Promise<SuggestionResponseDto> {
    const suggestion =
      await this.suggestionService.getSuggestionByPublicId(suggestionPublicId);

    if (suggestion.status !== SuggestionStatus.ACCEPTED) {
      throw new ConflictException(
        SUGGESTION_EXCEPTIONS.ONLY_ACCEPTED_CAN_PUBLISH_IMAGE,
      );
    }

    if (!suggestion.photoUrl) {
      throw new NotFoundException(SUGGESTION_EXCEPTIONS.SUGGESTION_NO_IMAGE);
    }

    const toilet = suggestion.toilet;

    if (!toilet || toilet.status !== ToiletStatus.ACTIVE) {
      throw new ConflictException(
        SUGGESTION_EXCEPTIONS.TOILET_MUST_BE_ACTIVE_TO_PUBLISH_IMAGE,
      );
    }

    const extension = suggestion.photoUrl.split('.').pop();
    const newFileName = `toilets/${uuidv4()}.${extension}`;

    await this.minioService.copyFile(suggestion.photoUrl, newFileName);

    await this.toiletService.updatePhotoUrl(toilet, newFileName);

    return plainToInstance(SuggestionResponseDto, suggestion, {
      excludeExtraneousValues: true,
    });
  }
}
