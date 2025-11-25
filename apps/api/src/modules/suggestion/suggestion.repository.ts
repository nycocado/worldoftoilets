import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  InteractionEntity,
  SuggestionEntity,
  SuggestionStatus,
  UserEntity,
} from '@database/entities';
import { EntityRepository, Transactional } from '@mikro-orm/mariadb';

/**
 * Gerencia o acesso e a persistência de dados para a entidade Suggestion.
 */
@Injectable()
export class SuggestionRepository {
  constructor(
    @InjectRepository(SuggestionEntity)
    private readonly repository: EntityRepository<SuggestionEntity>,
  ) {}

  /**
   * Busca uma sugestão pelo seu ID público.
   *
   * @param {string} publicId O ID público da sugestão.
   * @returns {Promise<SuggestionEntity | null>} A entidade da sugestão ou `null` se não for encontrada.
   */
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

  /**
   * Busca sugestões com base em filtros.
   *
   * @param {SuggestionStatus} [status] Filtra por status.
   * @param {boolean} [pageable] Ativa a paginação.
   * @param {number} [page] O número da página.
   * @param {number} [size] O tamanho da página.
   * @returns {Promise<SuggestionEntity[]>} Uma lista de sugestões.
   */
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

  /**
   * Busca sugestões de um utilizador específico.
   *
   * @param {string} userPublicId O ID público do utilizador.
   * @param {SuggestionStatus} [status] Filtra por status.
   * @param {boolean} [pageable] Ativa a paginação.
   * @param {number} [page] O número da página.
   * @param {number} [size] O tamanho da página.
   * @returns {Promise<SuggestionEntity[]>} Uma lista de sugestões.
   */
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

  /**
   * Cria uma nova sugestão.
   *
   * @param {InteractionEntity} interaction A interação associada.
   * @param {number} latitude A latitude da sugestão.
   * @param {number} longitude A longitude da sugestão.
   * @returns {Promise<SuggestionEntity>} A sugestão criada.
   */
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

  /**
   * Aceita uma sugestão.
   *
   * @param {SuggestionEntity} suggestion A sugestão a ser aceite.
   * @param {UserEntity} reviewer O utilizador que está a rever a sugestão.
   * @returns {Promise<SuggestionEntity>} A sugestão atualizada.
   */
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

  /**
   * Rejeita uma sugestão.
   *
   * @param {SuggestionEntity} suggestion A sugestão a ser rejeitada.
   * @param {UserEntity} reviewer O utilizador que está a rever a sugestão.
   * @returns {Promise<SuggestionEntity>} A sugestão atualizada.
   */
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

  /**
   * Define o estado de uma sugestão como pendente.
   *
   * @param {SuggestionEntity} suggestion A sugestão a ser atualizada.
   * @returns {Promise<SuggestionEntity>} A sugestão atualizada.
   */
  @Transactional()
  async setPending(suggestion: SuggestionEntity): Promise<SuggestionEntity> {
    const em = this.repository.getEntityManager();
    suggestion.status = SuggestionStatus.PENDING;
    suggestion.reviewedBy = undefined;
    suggestion.reviewedAt = undefined;
    await em.flush();
    return suggestion;
  }

  /**
   * Realiza o soft delete de uma sugestão.
   *
   * @param {SuggestionEntity} suggestion A sugestão a ser deletada.
   * @param {UserEntity} deletedBy O utilizador que realiza a exclusão.
   * @returns {Promise<void>}
   */
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

  /**
   * Remove uma sugestão permanentemente.
   *
   * @param {SuggestionEntity} suggestion A sugestão a ser removida.
   * @returns {Promise<void>}
   */
  @Transactional()
  async delete(suggestion: SuggestionEntity): Promise<void> {
    const em = this.repository.getEntityManager();
    await em.removeAndFlush(suggestion);
  }

  /**
   * Atualiza a URL da foto de uma sugestão.
   *
   * @param {SuggestionEntity} suggestion A sugestão a ser atualizada.
   * @param {string} photoUrl A nova URL da foto.
   * @returns {Promise<void>}
   */
  @Transactional()
  async updatePhotoUrl(
    suggestion: SuggestionEntity,
    photoUrl: string,
  ): Promise<void> {
    const em = this.repository.getEntityManager();
    suggestion.photoUrl = photoUrl;
    await em.flush();
  }
}
