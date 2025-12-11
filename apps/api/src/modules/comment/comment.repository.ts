import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  CommentEntity,
  CommentState,
  InteractionDiscriminator,
  ReactDiscriminator,
  ReactEntity,
  ToiletEntity,
  UserEntity,
} from '@database/entities';
import {
  EntityRepository,
  QueryOrder,
  Transactional,
} from '@mikro-orm/mariadb';
import { InteractionEntity } from '@database/entities/interaction.entity';

/**
 * Gerencia o acesso e a persistência de dados para a entidade CommentEntity.
 */
@Injectable()
export class CommentRepository {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: EntityRepository<CommentEntity>,
  ) {}

  /**
   * Busca um comentário pelo seu ID público.
   *
   * @param {string} publicId O ID público do comentário.
   * @returns {Promise<CommentEntity | null>} A entidade do comentário ou `null` se não for encontrado.
   */
  async findByPublicId(publicId: string): Promise<CommentEntity | null> {
    return this.commentRepository.findOne(
      { publicId: publicId },
      {
        populate: [
          'interaction.toilet.extras',
          'interaction.user.commentsCount',
          'interaction.user.partner',
          'rate',
          'likes',
          'dislikes',
          'replyCount',
        ],
      },
    );
  }

  /**
   * Busca um comentário pelo seu ID público com a reação do utilizador autenticado.
   *
   * @param {string} publicId O ID público do comentário.
   * @param {UserEntity} user O utilizador autenticado para buscar sua reação.
   * @returns {Promise<CommentEntity | null>} A entidade do comentário com myReact preenchido ou `null` se não for encontrado.
   */
  async findByPublicIdWithUserReact(
    publicId: string,
    user: UserEntity,
  ): Promise<CommentEntity | null> {
    const comment = await this.commentRepository.findOne(
      { publicId: publicId },
      {
        populate: [
          'interaction.toilet.extras',
          'interaction.user.commentsCount',
          'interaction.user.partner',
          'rate',
          'likes',
          'dislikes',
          'replyCount',
        ],
      },
    );

    if (!comment) {
      return null;
    }

    // Enriquecer comentário com myReact
    const em = this.commentRepository.getEntityManager();

    const reacts = await em.find(ReactEntity, {
      comment: comment,
      user: user,
      discriminator: {
        $in: [ReactDiscriminator.LIKE, ReactDiscriminator.DISLIKE],
      },
    });

    (comment as any).myReact =
      reacts.length > 0 ? reacts[0].discriminator : null;

    return comment;
  }

  /**
   * Busca comentários de um sanitário com opções de paginação e filtro.
   *
   * @param {ToiletEntity} toilet A entidade do sanitário.
   * @param {boolean} [pageable] Define se a paginação deve ser aplicada.
   * @param {number} [page] O número da página.
   * @param {number} [size] O tamanho da página.
   * @param {CommentState} [commentState] O estado do comentário para filtrar.
   * @param {Date} [timestamp] O timestamp máximo de criação.
   * @param {UserEntity} [user] O utilizador autenticado, para filtrar comentários denunciados por ele e buscar sua reação.
   * @returns {Promise<CommentEntity[]>} Uma lista de entidades de comentário.
   */
  async findByToilet(
    toilet: ToiletEntity,
    pageable?: boolean,
    page?: number,
    size?: number,
    commentState?: CommentState,
    timestamp?: Date,
    user?: UserEntity,
  ): Promise<CommentEntity[]> {
    const where: any = {
      state: commentState,
      interaction: {
        discriminator: InteractionDiscriminator.COMMENT,
        toilet: toilet,
      },
      createdAt: { $lte: timestamp },
    };

    if (user) {
      where.reacts = {
        $none: {
          user: user,
          discriminator: ReactDiscriminator.REPORT,
        },
      };
      where.interaction.user = {
        reportsReceived: {
          $none: {
            userReporter: user,
          },
        },
      };
    }

    const comments = await this.commentRepository.find(where, {
      populate: [
        'interaction.user.commentsCount',
        'interaction.user.partner',
        'rate',
        'likes',
        'dislikes',
        'replyCount',
      ],
      limit: pageable ? size : undefined,
      offset: pageable && page && size ? page * size : undefined,
      orderBy: { createdAt: QueryOrder.DESC },
    });

    // Se o usuário está autenticado, enriquecer comentários com myReact
    if (user) {
      const em = this.commentRepository.getEntityManager();

      const reacts = await em.find(ReactEntity, {
        comment: {
          id: {
            $in: comments.map((c) => c.id),
          },
        },
        user: user,
        discriminator: {
          $in: [ReactDiscriminator.LIKE, ReactDiscriminator.DISLIKE],
        },
      });

      const reactMap = new Map(
        reacts.map((r) => [r.comment.id, r.discriminator]),
      );

      comments.forEach((comment) => {
        (comment as any).myReact = reactMap.get(comment.id) || null;
      });
    } else {
      comments.forEach((comment) => {
        (comment as any).myReact = null;
      });
    }

    return comments;
  }

  /**
   * Busca comentários de um utilizador com opções de paginação e filtro.
   *
   * @param {UserEntity} user A entidade do utilizador.
   * @param {boolean} [pageable] Define se a paginação deve ser aplicada.
   * @param {number} [page] O número da página.
   * @param {number} [size] O tamanho da página.
   * @param {CommentState} [commentState] O estado do comentário para filtrar.
   * @param {Date} [timestamp] O timestamp máximo de criação.
   * @param {UserEntity} [requestUser] O utilizador autenticado que está fazendo a consulta, para filtrar comentários denunciados por ele e buscar sua reação.
   * @returns {Promise<CommentEntity[]>} Uma lista de entidades de comentário.
   */
  async findByUser(
    user: UserEntity,
    pageable?: boolean,
    page?: number,
    size?: number,
    commentState?: CommentState,
    timestamp?: Date,
    requestUser?: UserEntity,
  ): Promise<CommentEntity[]> {
    const where: any = {
      state: commentState,
      interaction: {
        discriminator: InteractionDiscriminator.COMMENT,
        user: user,
      },
      createdAt: { $lte: timestamp },
    };

    if (requestUser) {
      where.reacts = {
        $none: {
          user: requestUser,
          discriminator: ReactDiscriminator.REPORT,
        },
      };
    }

    const comments = await this.commentRepository.find(where, {
      populate: [
        'interaction.toilet.access',
        'interaction.toilet.extras',
        'interaction.toilet.totalRatings',
        'interaction.toilet.avgClean',
        'interaction.toilet.avgStructure',
        'interaction.toilet.avgAccessibility',
        'interaction.toilet.paperAvailability',
        'interaction.user.commentsCount',
        'interaction.user.partner',
        'rate',
        'likes',
        'dislikes',
        'replyCount',
      ],
      limit: pageable ? size : undefined,
      offset: pageable && page && size ? page * size : undefined,
      orderBy: { createdAt: QueryOrder.DESC },
    });

    // Se o usuário está autenticado, enriquecer comentários com myReact
    if (requestUser) {
      const em = this.commentRepository.getEntityManager();

      const reacts = await em.find(ReactEntity, {
        comment: {
          id: {
            $in: comments.map((c) => c.id),
          },
        },
        user: requestUser,
        discriminator: {
          $in: [ReactDiscriminator.LIKE, ReactDiscriminator.DISLIKE],
        },
      });

      const reactMap = new Map(
        reacts.map((r) => [r.comment.id, r.discriminator]),
      );

      comments.forEach((comment) => {
        (comment as any).myReact = reactMap.get(comment.id) || null;
      });
    } else {
      comments.forEach((comment) => {
        (comment as any).myReact = null;
      });
    }

    return comments;
  }

  /**
   * Busca comentários que sofreram soft delete e cujo período de retenção expirou.
   *
   * @param {Date} retention A data limite de retenção.
   * @returns {Promise<CommentEntity[]>} Uma lista de comentários expirados.
   */
  async findExpired(retention: Date): Promise<CommentEntity[]> {
    return this.commentRepository.find({
      deletedAt: {
        $lte: retention,
      },
    });
  }

  /**
   * Cria e persiste um novo comentário.
   *
   * @param {InteractionEntity} interaction A entidade de interação associada.
   * @param {string} [text] O texto do comentário.
   * @returns {Promise<CommentEntity>} A entidade do comentário criado.
   */
  @Transactional()
  async create(
    interaction: InteractionEntity,
    text?: string,
  ): Promise<CommentEntity> {
    const em = this.commentRepository.getEntityManager();
    const comment = new CommentEntity();
    comment.interaction = interaction;
    comment.text = text;
    em.persist(comment);
    await em.flush();
    return comment;
  }

  /**
   * Realiza o soft delete de um comentário, marcando-o como oculto e registrando quem o deletou.
   *
   * @param {CommentEntity} comment O comentário a ser deletado.
   * @param {UserEntity} deletedBy O utilizador que realizou a exclusão.
   * @returns {Promise<CommentEntity>} A entidade do comentário atualizado.
   */
  @Transactional()
  async softDelete(
    comment: CommentEntity,
    deletedBy: UserEntity,
  ): Promise<CommentEntity> {
    const em = this.commentRepository.getEntityManager();
    comment.state = CommentState.HIDDEN;
    comment.deletedBy = deletedBy;
    comment.deletedAt = new Date();
    em.persist(comment);
    await em.flush();
    return comment;
  }

  /**
   * Remove um comentário permanentemente do banco de dados.
   *
   * @param {CommentEntity} comment O comentário a ser removido.
   * @returns {Promise<void>}
   */
  @Transactional()
  async delete(comment: CommentEntity): Promise<void> {
    const em = this.commentRepository.getEntityManager();
    em.remove(comment);
    await em.flush();
  }

  /**
   * Remove permanentemente os comentários cujo período de retenção do soft delete expirou.
   *
   * @param {Date} retention A data limite de retenção.
   * @returns {Promise<void>}
   */
  @Transactional()
  async deleteExpired(retention: Date): Promise<void> {
    const em = this.commentRepository.getEntityManager();
    const comments = await this.findExpired(retention);
    em.remove(comments);
    await em.flush();
  }

  /**
   * Atualiza o texto de um comentário.
   *
   * @param {CommentEntity} comment O comentário a ser atualizado.
   * @param {string} [text] O novo texto do comentário.
   * @returns {Promise<CommentEntity>} A entidade do comentário atualizado.
   */
  @Transactional()
  async update(comment: CommentEntity, text?: string): Promise<CommentEntity> {
    const em = this.commentRepository.getEntityManager();
    if (text !== undefined) {
      comment.text = text;
    }
    em.persist(comment);
    await em.flush();
    return comment;
  }

  /**
   * Altera o estado de visibilidade de um comentário.
   *
   * @param {CommentEntity} comment O comentário a ser atualizado.
   * @param {CommentState} state O novo estado do comentário.
   * @returns {Promise<CommentEntity>} A entidade do comentário atualizado.
   */
  @Transactional()
  async changeState(
    comment: CommentEntity,
    state: CommentState,
  ): Promise<CommentEntity> {
    const em = this.commentRepository.getEntityManager();
    comment.state = state;
    em.persist(comment);
    await em.flush();
    return comment;
  }

  /**
   * Reverte o soft delete de um comentário.
   *
   * @param {CommentEntity} comment O comentário a ser recuperado.
   * @returns {Promise<CommentEntity>} A entidade do comentário restaurado.
   */
  @Transactional()
  async undelete(comment: CommentEntity): Promise<CommentEntity> {
    const em = this.commentRepository.getEntityManager();
    comment.state = CommentState.VISIBLE;
    comment.deletedBy = undefined;
    comment.deletedAt = undefined;
    em.persist(comment);
    await em.flush();
    return comment;
  }
}
