import { Injectable } from '@nestjs/common';
import { InteractionRepository } from '@modules/interaction/interaction.repository';
import {
  InteractionDiscriminator,
  InteractionEntity,
  ToiletEntity,
  UserEntity,
} from '@database/entities';

/**
 * Contém a lógica de negócio para as operações de interação.
 */
@Injectable()
export class InteractionService {
  constructor(private readonly interactionRepository: InteractionRepository) {}

  /**
   * Cria uma nova interação entre um utilizador e uma casa de banho.
   *
   * @param {UserEntity} user O utilizador que realiza a interação.
   * @param {ToiletEntity} toilet A casa de banho alvo da interação.
   * @param {InteractionDiscriminator} discriminator O tipo de interação.
   * @returns {Promise<InteractionEntity>} A entidade da interação criada.
   */
  async createInteraction(
    user: UserEntity,
    toilet: ToiletEntity,
    discriminator: InteractionDiscriminator,
  ): Promise<InteractionEntity> {
    return this.interactionRepository.create(user, toilet, discriminator);
  }

  /**
   * Realiza o soft delete de uma interação.
   *
   * @param {InteractionEntity} interaction A interação a ser apagada.
   * @param {UserEntity} user O utilizador (moderador) que apaga a interação.
   * @returns {Promise<InteractionEntity>} A entidade da interação atualizada.
   */
  async softDeleteInteraction(
    interaction: InteractionEntity,
    user: UserEntity,
  ): Promise<InteractionEntity> {
    return this.interactionRepository.softDelete(interaction, user);
  }

  /**
   * Busca uma interação específica baseada em utilizador, casa de banho e discriminador.
   *
   * @param {UserEntity} user O utilizador da interação.
   * @param {ToiletEntity} toilet A casa de banho da interação.
   * @param {InteractionDiscriminator} discriminator O tipo de interação.
   * @returns {Promise<InteractionEntity | null>} A interação encontrada ou null.
   */
  async findInteraction(
    user: UserEntity,
    toilet: ToiletEntity,
    discriminator: InteractionDiscriminator,
  ): Promise<InteractionEntity | null> {
    return this.interactionRepository.findOne(user, toilet, discriminator);
  }
}
