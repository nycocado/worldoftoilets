import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  InteractionDiscriminator,
  InteractionEntity,
  ToiletEntity,
  UserEntity,
} from '@database/entities';
import { EntityRepository, Transactional } from '@mikro-orm/mariadb';

/**
 * Gerencia o acesso e a persistência de dados para a entidade InteractionEntity.
 */
@Injectable()
export class InteractionRepository {
  constructor(
    @InjectRepository(InteractionEntity)
    private readonly interactionRepository: EntityRepository<InteractionEntity>,
  ) {}

  /**
   * Cria e persiste uma nova entidade de interação.
   *
   * @param {UserEntity} user O utilizador que realiza a interação.
   * @param {ToiletEntity} toilet A casa de banho alvo da interação.
   * @param {InteractionDiscriminator} discriminator O tipo de interação.
   * @returns {Promise<InteractionEntity>} A entidade da interação persistida.
   */
  @Transactional()
  async create(
    user: UserEntity,
    toilet: ToiletEntity,
    discriminator: InteractionDiscriminator,
  ): Promise<InteractionEntity> {
    const em = this.interactionRepository.getEntityManager();
    const interaction = new InteractionEntity();
    interaction.user = user;
    interaction.toilet = toilet;
    interaction.discriminator = discriminator;
    em.persist(interaction);
    await em.flush();
    return interaction;
  }

  /**
   * Atualiza uma entidade de interação com dados de soft delete.
   *
   * @param {InteractionEntity} interaction A entidade a ser atualizada.
   * @param {UserEntity} user O utilizador (moderador) que realiza o soft delete.
   * @returns {Promise<InteractionEntity>} A entidade da interação atualizada.
   */
  @Transactional()
  async softDelete(
    interaction: InteractionEntity,
    user: UserEntity,
  ): Promise<InteractionEntity> {
    const em = this.interactionRepository.getEntityManager();
    interaction.deletedBy = user;
    interaction.deletedAt = new Date();
    em.persist(interaction);
    await em.flush();
    return interaction;
  }

  /**
   * Busca uma interação específica baseada em utilizador, casa de banho e discriminador.
   *
   * @param {UserEntity} user O utilizador da interação.
   * @param {ToiletEntity} toilet A casa de banho da interação.
   * @param {InteractionDiscriminator} discriminator O tipo de interação.
   * @returns {Promise<InteractionEntity | null>} A interação encontrada ou null.
   */
  async findOne(
    user: UserEntity,
    toilet: ToiletEntity,
    discriminator: InteractionDiscriminator,
  ): Promise<InteractionEntity | null> {
    return this.interactionRepository.findOne({
      user,
      toilet,
      discriminator,
    });
  }
}
