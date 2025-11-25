import { Injectable } from '@nestjs/common';
import { ReactRepository } from '@modules/react/react.repository';
import {
  CommentEntity,
  ReactDiscriminator,
  ReactEntity,
  UserEntity,
} from '@database/entities';

/**
 * Contém a lógica de negócio para as operações de reações.
 */
@Injectable()
export class ReactService {
  constructor(private readonly reactRepository: ReactRepository) {}

  /**
   * Obtém a reação de um utilizador a um comentário específico.
   *
   * @param {UserEntity} user O utilizador.
   * @param {CommentEntity} comment O comentário.
   * @returns {Promise<ReactEntity | null>} A entidade da reação ou nulo se não existir.
   */
  async getReactByUserAndComment(
    user: UserEntity,
    comment: CommentEntity,
  ): Promise<ReactEntity | null> {
    return this.reactRepository.findByUserAndComment(user, comment);
  }

  /**
   * Cria uma nova reação a um comentário.
   *
   * @param {UserEntity} user O utilizador que reage.
   * @param {CommentEntity} comment O comentário que recebe a reação.
   * @param {ReactDiscriminator} discriminator O tipo de reação (like/dislike).
   * @returns {Promise<ReactEntity>} A entidade da reação criada.
   */
  async createReact(
    user: UserEntity,
    comment: CommentEntity,
    discriminator: ReactDiscriminator,
  ): Promise<ReactEntity> {
    return this.reactRepository.create(user, comment, discriminator);
  }

  /**
   * Atualiza o tipo de uma reação existente.
   *
   * @param {ReactEntity} react A reação a ser atualizada.
   * @param {ReactDiscriminator} discriminator O novo tipo de reação.
   * @returns {Promise<ReactEntity>} A entidade da reação atualizada.
   */
  async updateReact(
    react: ReactEntity,
    discriminator: ReactDiscriminator,
  ): Promise<ReactEntity> {
    return this.reactRepository.update(react, discriminator);
  }

  /**
   * Remove uma reação.
   *
   * @param {ReactEntity} react A reação a ser removida.
   * @returns {Promise<void>}
   */
  async deleteReact(react: ReactEntity): Promise<void> {
    return this.reactRepository.delete(react);
  }
}
