import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  CommentEntity,
  ReactDiscriminator,
  ReactEntity,
  UserEntity,
} from '@database/entities';
import {
  EntityManager,
  EntityRepository,
  Transactional,
} from '@mikro-orm/mariadb';

/**
 * Interface para a contagem de reações de um comentário.
 */
export interface CommentReactionCount {
  commentId: number;
  publicId: string;
  likes: number;
  dislikes: number;
}

/**
 * Gerencia o acesso e a persistência de dados para a entidade React.
 */
@Injectable()
export class ReactRepository {
  constructor(
    @InjectRepository(ReactEntity)
    private readonly repository: EntityRepository<ReactEntity>,
    private readonly em: EntityManager,
  ) {}

  /**
   * Busca uma reação de um utilizador a um comentário específico.
   *
   * @param {UserEntity} user O utilizador que reagiu.
   * @param {CommentEntity} comment O comentário que recebeu a reação.
   * @returns {Promise<ReactEntity | null>} A entidade da reação ou `null` se não for encontrada.
   */
  async findByUserAndComment(
    user: UserEntity,
    comment: CommentEntity,
  ): Promise<ReactEntity | null> {
    return this.repository.findOne({
      user: user,
      comment: comment,
    });
  }

  /**
   * Cria uma nova reação.
   *
   * @param {UserEntity} user O utilizador que está a reagir.
   * @param {CommentEntity} comment O comentário que está a receber a reação.
   * @param {ReactDiscriminator} discriminator O tipo de reação (like/dislike).
   * @returns {Promise<ReactEntity>} A entidade da reação criada.
   */
  @Transactional()
  async create(
    user: UserEntity,
    comment: CommentEntity,
    discriminator: ReactDiscriminator,
  ): Promise<ReactEntity> {
    const em = this.repository.getEntityManager();
    const react = new ReactEntity();
    react.user = user;
    react.comment = comment;
    react.discriminator = discriminator;
    await em.persistAndFlush(react);
    return react;
  }

  /**
   * Atualiza o tipo de uma reação existente.
   *
   * @param {ReactEntity} react A reação a ser atualizada.
   * @param {ReactDiscriminator} discriminator O novo tipo de reação.
   * @returns {Promise<ReactEntity>} A entidade da reação atualizada.
   */
  @Transactional()
  async update(
    react: ReactEntity,
    discriminator: ReactDiscriminator,
  ): Promise<ReactEntity> {
    const em = this.repository.getEntityManager();
    react.discriminator = discriminator;
    await em.persistAndFlush(react);
    return react;
  }

  /**
   * Remove uma reação.
   *
   * @param {ReactEntity} react A reação a ser removida.
   * @returns {Promise<void>}
   */
  @Transactional()
  async delete(react: ReactEntity): Promise<void> {
    const em = this.repository.getEntityManager();
    await em.removeAndFlush(react);
  }
}
