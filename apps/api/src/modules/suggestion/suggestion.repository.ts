import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  InteractionEntity,
  SuggestionEntity,
  SuggestionStatus,
  UserEntity,
} from '@database/entities';
import { EntityRepository, Transactional } from '@mikro-orm/mariadb';

@Injectable()
export class SuggestionRepository {
  constructor(
    @InjectRepository(SuggestionEntity)
    private readonly repository: EntityRepository<SuggestionEntity>,
  ) {}

  async findByPublicId(publicId: string): Promise<SuggestionEntity | null> {
    return this.repository.findOne(
      { publicId },
      {
        populate: [
          'interaction',
          'interaction.user',
          'interaction.user.commentsCount',
          'interaction.toilet',
          'interaction.toilet.access',
          'interaction.toilet.extras',
          'interaction.toilet.totalRatings',
          'interaction.toilet.avgClean',
          'interaction.toilet.avgStructure',
          'interaction.toilet.avgAccessibility',
          'interaction.toilet.paperAvailability',
          'reviewedBy',
        ],
      },
    );
  }

  async find(
    status?: SuggestionStatus,
    pageable?: boolean,
    page?: number,
    size?: number,
  ): Promise<SuggestionEntity[]> {
    return this.repository.find(
      {
        ...(status && { status }),
      },
      {
        populate: [
          'interaction',
          'interaction.user',
          'interaction.user.commentsCount',
          'interaction.toilet',
          'interaction.toilet.access',
          'interaction.toilet.extras',
          'interaction.toilet.totalRatings',
          'interaction.toilet.avgClean',
          'interaction.toilet.avgStructure',
          'interaction.toilet.avgAccessibility',
          'interaction.toilet.paperAvailability',
          'reviewedBy',
        ],
        ...(pageable &&
          page !== undefined &&
          size !== undefined && {
            limit: size,
            offset: page * size,
          }),
      },
    );
  }

  async findByUser(
    userPublicId: string,
    status?: SuggestionStatus,
    pageable?: boolean,
    page?: number,
    size?: number,
  ): Promise<SuggestionEntity[]> {
    return this.repository.find(
      {
        interaction: { user: { publicId: userPublicId } },
        ...(status && { status }),
      },
      {
        populate: [
          'interaction',
          'interaction.user',
          'interaction.user.commentsCount',
          'interaction.toilet',
          'interaction.toilet.access',
          'interaction.toilet.extras',
          'interaction.toilet.totalRatings',
          'interaction.toilet.avgClean',
          'interaction.toilet.avgStructure',
          'interaction.toilet.avgAccessibility',
          'interaction.toilet.paperAvailability',
          'reviewedBy',
        ],
        ...(pageable &&
          page !== undefined &&
          size !== undefined && {
            limit: size,
            offset: page * size,
          }),
      },
    );
  }

  @Transactional()
  async create(
    interaction: InteractionEntity,
    latitude: number,
    longitude: number,
  ): Promise<SuggestionEntity> {
    const em = this.repository.getEntityManager();
    const suggestion = new SuggestionEntity();
    suggestion.interaction = interaction;
    suggestion.latitude = latitude;
    suggestion.longitude = longitude;
    suggestion.status = SuggestionStatus.PENDING;
    await em.persistAndFlush(suggestion);
    return suggestion;
  }

  @Transactional()
  async acceptSuggestion(
    suggestion: SuggestionEntity,
    reviewer: UserEntity,
  ): Promise<SuggestionEntity> {
    const em = this.repository.getEntityManager();
    suggestion.status = SuggestionStatus.ACCEPTED;
    suggestion.reviewedBy = reviewer;
    suggestion.reviewedAt = new Date();
    await em.flush();
    return suggestion;
  }

  @Transactional()
  async rejectSuggestion(
    suggestion: SuggestionEntity,
    reviewer: UserEntity,
  ): Promise<SuggestionEntity> {
    const em = this.repository.getEntityManager();
    suggestion.status = SuggestionStatus.REJECTED;
    suggestion.reviewedBy = reviewer;
    suggestion.reviewedAt = new Date();
    await em.flush();
    return suggestion;
  }

  @Transactional()
  async setPending(suggestion: SuggestionEntity): Promise<SuggestionEntity> {
    const em = this.repository.getEntityManager();
    suggestion.status = SuggestionStatus.PENDING;
    suggestion.reviewedBy = undefined;
    suggestion.reviewedAt = undefined;
    await em.flush();
    return suggestion;
  }

  @Transactional()
  async softDelete(
    suggestion: SuggestionEntity,
    deletedBy: UserEntity,
  ): Promise<void> {
    const em = this.repository.getEntityManager();
    suggestion.interaction.deletedBy = deletedBy;
    suggestion.interaction.deletedAt = new Date();
    await em.flush();
  }

  @Transactional()
  async delete(suggestion: SuggestionEntity): Promise<void> {
    const em = this.repository.getEntityManager();
    await em.removeAndFlush(suggestion);
  }
}
