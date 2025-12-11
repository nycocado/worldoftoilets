import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  CommentEntity,
  ReplyEntity,
  ReplyState,
  UserEntity,
} from '@database/entities';
import {
  EntityRepository,
  QueryOrder,
  Transactional,
} from '@mikro-orm/mariadb';
import { REPLY_EXCEPTIONS } from './constants';

/**
 * Gerencia o acesso e a persistência de dados para a entidade Reply.
 */
@Injectable()
export class ReplyRepository {
  constructor(
    @InjectRepository(ReplyEntity)
    private readonly repository: EntityRepository<ReplyEntity>,
  ) {}

  /**
   * Busca uma resposta pelo seu ID público.
   *
   * @param {string} publicId O ID público da resposta.
   * @returns {Promise<ReplyEntity | null>} A entidade da resposta ou `null` se não for encontrada.
   */
  async findByPublicId(publicId: string): Promise<ReplyEntity | null> {
    return this.repository.findOne(
      { publicId: publicId },
      { populate: ['user', 'comment'] },
    );
  }

  /**
   * Busca respostas de um comentário com opções de paginação e filtro.
   *
   * @param {CommentEntity} comment A entidade do comentário.
   * @param {boolean} [pageable] Define se a paginação deve ser aplicada.
   * @param {number} [page] O número da página.
   * @param {number} [size] O tamanho da página.
   * @param {ReplyState} [replyState] O estado da resposta para filtrar.
   * @param {Date} [timestamp] O timestamp máximo de criação.
   * @param {UserEntity} [requestUser] O utilizador autenticado, para filtrar respostas de usuários denunciados por ele.
   * @returns {Promise<ReplyEntity[]>} Uma lista de entidades de resposta.
   */
  async findByComment(
    comment: CommentEntity,
    pageable?: boolean,
    page?: number,
    size?: number,
    replyState?: ReplyState,
    timestamp?: Date,
    requestUser?: UserEntity,
  ): Promise<ReplyEntity[]> {
    return this.repository.find(
      {
        state: replyState,
        comment: comment,
        createdAt: { $lte: timestamp },
        ...(requestUser && {
          reports: {
            $none: {
              user: requestUser,
            },
          },
          user: {
            reportsReceived: {
              $none: {
                userReporter: requestUser,
              },
            },
          },
        }),
      },
      {
        populate: ['user.partner', 'user.commentsCount'],
        limit: pageable ? size : undefined,
        offset: pageable && page && size ? page * size : undefined,
        orderBy: { createdAt: QueryOrder.DESC },
      },
    );
  }

  /**
   * Busca respostas de um utilizador com opções de paginação e filtro.
   *
   * @param {UserEntity} user A entidade do utilizador.
   * @param {boolean} [pageable] Define se a paginação deve ser aplicada.
   * @param {number} [page] O número da página.
   * @param {number} [size] O tamanho da página.
   * @param {ReplyState} [replyState] O estado da resposta para filtrar.
   * @param {Date} [timestamp] O timestamp máximo de criação.
   * @returns {Promise<ReplyEntity[]>} Uma lista de entidades de resposta.
   */
  async findByUser(
    user: UserEntity,
    pageable?: boolean,
    page?: number,
    size?: number,
    replyState?: ReplyState,
    timestamp?: Date,
  ): Promise<ReplyEntity[]> {
    return this.repository.find(
      {
        state: replyState,
        user: user,
        createdAt: { $lte: timestamp },
      },
      {
        populate: ['user.partner', 'user.commentsCount'],
        limit: pageable ? size : undefined,
        offset: pageable && page && size ? page * size : undefined,
        orderBy: { createdAt: QueryOrder.DESC },
      },
    );
  }

  /**
   * Busca respostas que sofreram soft delete e cujo período de retenção expirou.
   *
   * @param {Date} retention A data limite de retenção.
   * @returns {Promise<ReplyEntity[]>} Uma lista de respostas expiradas.
   */
  async findExpired(retention: Date): Promise<ReplyEntity[]> {
    return this.repository.find({
      deletedAt: {
        $lte: retention,
      },
    });
  }

  /**
   * Cria e persiste uma nova resposta.
   *
   * @param {CommentEntity} comment A entidade do comentário associada.
   * @param {UserEntity} user O utilizador que criou a resposta.
   * @param {string} text O texto da resposta.
   * @returns {Promise<ReplyEntity>} A entidade da resposta criada.
   */
  @Transactional()
  async create(
    comment: CommentEntity,
    user: UserEntity,
    text: string,
  ): Promise<ReplyEntity> {
    const em = this.repository.getEntityManager();
    const reply = new ReplyEntity();
    reply.comment = comment;
    reply.user = user;
    reply.text = text;
    em.persist(reply);
    await em.flush();
    return reply;
  }

  /**
   * Realiza o soft delete de uma resposta, marcando-a como oculta e registrando quem a deletou.
   *
   * @param {ReplyEntity} reply A resposta a ser deletada.
   * @param {UserEntity} deletedBy O utilizador que realizou a exclusão.
   * @returns {Promise<ReplyEntity>} A entidade da resposta atualizada.
   */
  @Transactional()
  async softDelete(
    reply: ReplyEntity,
    deletedBy: UserEntity,
  ): Promise<ReplyEntity> {
    if (reply.state === ReplyState.HIDDEN) {
      throw new BadRequestException(REPLY_EXCEPTIONS.REPLY_ALREADY_HIDDEN);
    }
    const em = this.repository.getEntityManager();
    reply.state = ReplyState.HIDDEN;
    reply.deletedBy = deletedBy;
    em.persist(reply);
    await em.flush();
    return reply;
  }

  /**
   * Remove uma resposta permanentemente do banco de dados.
   *
   * @param {ReplyEntity} reply A resposta a ser removida.
   * @returns {Promise<void>}
   */
  @Transactional()
  async delete(reply: ReplyEntity): Promise<void> {
    const em = this.repository.getEntityManager();
    em.remove(reply);
    await em.flush();
  }

  /**
   * Remove permanentemente as respostas cujo período de retenção do soft delete expirou.
   *
   * @param {Date} retention A data limite de retenção.
   * @returns {Promise<void>}
   */
  @Transactional()
  async deleteExpired(retention: Date): Promise<void> {
    const em = this.repository.getEntityManager();
    const replies = await this.findExpired(retention);
    em.remove(replies);
    await em.flush();
  }

  /**
   * Atualiza o texto de uma resposta.
   *
   * @param {ReplyEntity} reply A resposta a ser atualizada.
   * @param {string} [text] O novo texto da resposta.
   * @returns {Promise<ReplyEntity>} A entidade da resposta atualizada.
   */
  @Transactional()
  async update(reply: ReplyEntity, text?: string): Promise<ReplyEntity> {
    const em = this.repository.getEntityManager();
    em.persist(reply);
    await em.flush();
    return reply;
  }

  /**
   * Altera o estado de visibilidade de uma resposta.
   *
   * @param {ReplyEntity} reply A resposta a ser atualizada.
   * @param {ReplyState} state O novo estado da resposta.
   * @returns {Promise<ReplyEntity>} A entidade da resposta atualizada.
   */
  @Transactional()
  async changeState(
    reply: ReplyEntity,
    state: ReplyState,
  ): Promise<ReplyEntity> {
    const em = this.repository.getEntityManager();
    reply.state = state;
    em.persist(reply);
    await em.flush();
    return reply;
  }

  /**
   * Reverte o soft delete de uma resposta.
   *
   * @param {ReplyEntity} reply A resposta a ser recuperada.
   * @returns {Promise<ReplyEntity>} A entidade da resposta restaurada.
   */
  @Transactional()
  async undelete(reply: ReplyEntity): Promise<ReplyEntity> {
    const em = this.repository.getEntityManager();
    reply.state = ReplyState.VISIBLE;
    reply.deletedBy = undefined;
    reply.deletedAt = undefined;
    em.persist(reply);
    await em.flush();
    return reply;
  }
}
