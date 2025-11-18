import { Injectable } from '@nestjs/common';
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

/**
 * Repositório de Respostas
 *
 * @class ReplyRepository
 * @description Repositório de acesso a dados para entidade ReplyEntity.
 * Oferece operações CRUD e queries complexas para respostas, incluindo:
 * - Busca por publicId, comentário ou utilizador
 * - Operações transacionais de criação, atualização e remoção
 * - Gestão de soft delete e estados de respostas
 * - Queries com paginação e ordenação
 *
 * @implements
 *   - Padrão Repository para isolar lógica de acesso a dados
 *   - Transações com decorator @Transactional do MikroORM
 *   - Soft delete com período de retenção
 *
 * @see ReplyEntity - Entidade de domínio representando respostas
 */
@Injectable()
export class ReplyRepository {
  /**
   * Construtor do ReplyRepository
   *
   * @param {EntityRepository<ReplyEntity>} repository - Repositório MikroORM injetado
   */
  constructor(
    @InjectRepository(ReplyEntity)
    private readonly repository: EntityRepository<ReplyEntity>,
  ) {}

  /**
   * Buscar resposta por publicId
   *
   * @async
   * @param {string} publicId - Identificador público único da resposta
   * @returns {Promise<ReplyEntity | null>} Resposta encontrada ou null
   *
   * @description
   * Busca uma resposta pelo seu publicId (UUID).
   * Carrega automaticamente o utilizador e o comentário associado.
   */
  async findByPublicId(publicId: string): Promise<ReplyEntity | null> {
    return this.repository.findOne(
      { publicId: publicId },
      { populate: ['user', 'comment'] },
    );
  }

  /**
   * Buscar respostas por comentário
   *
   * @async
   * @param {CommentEntity} comment - Entidade de comentário
   * @param {boolean} pageable - Se deve aplicar paginação
   * @param {number} page - Número da página (zero-indexed)
   * @param {number} size - Tamanho da página
   * @param {ReplyState} replyState - Estado das respostas a buscar (VISIBLE, HIDDEN)
   * @param {Date} timestamp - Data limite para buscar respostas (respostas criadas antes desta data)
   * @returns {Promise<ReplyEntity[]>} Lista de respostas
   *
   * @description
   * Busca respostas de um comentário específico com suporte a paginação.
   * Filtra por estado da resposta e timestamp de criação.
   * Carrega automaticamente o utilizador (com partner).
   * Ordenado por data de criação descendente (mais recentes primeiro).
   */
  async findByComment(
    comment: CommentEntity,
    pageable?: boolean,
    page?: number,
    size?: number,
    replyState?: ReplyState,
    timestamp?: Date,
  ): Promise<ReplyEntity[]> {
    return this.repository.find(
      {
        state: replyState,
        comment: comment,
        createdAt: { $lte: timestamp },
      },
      {
        populate: ['user.partner'],
        limit: pageable ? size : undefined,
        offset: pageable && page && size ? page * size : undefined,
        orderBy: { createdAt: QueryOrder.DESC },
      },
    );
  }

  /**
   * Buscar respostas por utilizador
   *
   * @async
   * @param {UserEntity} user - Entidade de utilizador
   * @param {boolean} pageable - Se deve aplicar paginação
   * @param {number} page - Número da página (zero-indexed)
   * @param {number} size - Tamanho da página
   * @param {ReplyState} replyState - Estado das respostas a buscar (VISIBLE, HIDDEN)
   * @param {Date} timestamp - Data limite para buscar respostas (respostas criadas antes desta data)
   * @returns {Promise<ReplyEntity[]>} Lista de respostas
   *
   * @description
   * Busca respostas de um utilizador específico com suporte a paginação.
   * Filtra por estado da resposta e timestamp de criação.
   * Carrega automaticamente o comentário associado.
   * Ordenado por data de criação descendente (mais recentes primeiro).
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
        populate: ['comment'],
        limit: pageable ? size : undefined,
        offset: pageable && page && size ? page * size : undefined,
        orderBy: { createdAt: QueryOrder.DESC },
      },
    );
  }

  /**
   * Buscar respostas expiradas
   *
   * @async
   * @param {Date} retention - Data de retenção limite
   * @returns {Promise<ReplyEntity[]>} Lista de respostas expiradas
   *
   * @description
   * Busca respostas soft-deleted há mais tempo que o período de retenção.
   * Usado pelo cron job de limpeza para remover respostas permanentemente.
   */
  async findExpired(retention: Date): Promise<ReplyEntity[]> {
    return this.repository.find({
      deletedAt: {
        $lte: retention,
      },
    });
  }

  /**
   * Criar nova resposta
   *
   * @async
   * @transactional Executa dentro de transação
   * @param {CommentEntity} comment - Comentário ao qual a resposta pertence
   * @param {UserEntity} user - Utilizador que criou a resposta
   * @param {string} text - Texto da resposta
   * @returns {Promise<ReplyEntity>} Resposta criada
   *
   * @description
   * Cria nova resposta associada a um comentário e utilizador.
   * Persiste imediatamente no banco de dados (flush).
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
    await em.persistAndFlush(reply);
    return reply;
  }

  /**
   * Soft delete de resposta
   *
   * @async
   * @transactional Executa dentro de transação
   * @param {ReplyEntity} reply - Resposta a ser marcada como deletada
   * @param {UserEntity} deletedBy - Utilizador que deletou a resposta
   * @returns {Promise<ReplyEntity>} Resposta atualizada
   *
   * @description
   * Marca resposta como deletada sem remover do banco de dados.
   * Altera estado para HIDDEN, registra quem deletou e timestamp.
   * Resposta pode ser recuperada com undelete antes de expirar.
   */
  @Transactional()
  async softDelete(
    reply: ReplyEntity,
    deletedBy: UserEntity,
  ): Promise<ReplyEntity> {
    const em = this.repository.getEntityManager();
    reply.state = ReplyState.HIDDEN;
    reply.deletedBy = deletedBy;
    reply.deletedAt = new Date();
    await em.persistAndFlush(reply);
    return reply;
  }

  /**
   * Deletar resposta permanentemente
   *
   * @async
   * @transactional Executa dentro de transação
   * @param {ReplyEntity} reply - Resposta a ser removida
   * @returns {Promise<void>}
   *
   * @description
   * Remove resposta permanentemente do banco de dados.
   * Operação irreversível - normalmente usado apenas pelo cron job de limpeza.
   */
  @Transactional()
  async delete(reply: ReplyEntity): Promise<void> {
    const em = this.repository.getEntityManager();
    await em.removeAndFlush(reply);
  }

  /**
   * Deletar respostas expiradas permanentemente
   *
   * @async
   * @transactional Executa dentro de transação
   * @param {Date} retention - Data de retenção limite
   * @returns {Promise<void>}
   *
   * @description
   * Remove permanentemente todas as respostas soft-deleted há mais tempo que o período de retenção.
   * Chamado pelo cron job diário de limpeza.
   * Operação em batch para eficiência.
   */
  @Transactional()
  async deleteExpired(retention: Date): Promise<void> {
    const em = this.repository.getEntityManager();
    const replies = await this.findExpired(retention);
    await em.removeAndFlush(replies);
  }

  /**
   * Atualizar resposta
   *
   * @async
   * @transactional Executa dentro de transação
   * @param {ReplyEntity} reply - Resposta a ser atualizada
   * @param {string} text - Novo texto da resposta (opcional)
   * @returns {Promise<ReplyEntity>} Resposta atualizada
   *
   * @description
   * Atualiza texto da resposta se fornecido.
   * Se text for undefined, nenhuma alteração é feita ao texto.
   * Persiste mudanças imediatamente no banco de dados.
   */
  @Transactional()
  async update(reply: ReplyEntity, text?: string): Promise<ReplyEntity> {
    const em = this.repository.getEntityManager();
    if (text !== undefined) {
      reply.text = text;
    }
    await em.persistAndFlush(reply);
    return reply;
  }

  /**
   * Alterar estado da resposta
   *
   * @async
   * @transactional Executa dentro de transação
   * @param {ReplyEntity} reply - Resposta a ser atualizada
   * @param {ReplyState} state - Novo estado (VISIBLE ou HIDDEN)
   * @returns {Promise<ReplyEntity>} Resposta atualizada
   *
   * @description
   * Altera estado de visibilidade da resposta.
   * Usado por operações de moderação (hide/show).
   * Persiste mudanças imediatamente no banco de dados.
   */
  @Transactional()
  async changeState(
    reply: ReplyEntity,
    state: ReplyState,
  ): Promise<ReplyEntity> {
    const em = this.repository.getEntityManager();
    reply.state = state;
    await em.persistAndFlush(reply);
    return reply;
  }

  /**
   * Recuperar resposta deletada
   *
   * @async
   * @transactional Executa dentro de transação
   * @param {ReplyEntity} reply - Resposta a ser recuperada
   * @returns {Promise<ReplyEntity>} Resposta restaurada
   *
   * @description
   * Reverte soft delete de resposta.
   * Restaura estado para VISIBLE e limpa campos deletedBy e deletedAt.
   * Apenas funciona para respostas soft-deleted que ainda não foram removidas permanentemente.
   */
  @Transactional()
  async undelete(reply: ReplyEntity): Promise<ReplyEntity> {
    const em = this.repository.getEntityManager();
    reply.state = ReplyState.VISIBLE;
    reply.deletedBy = undefined;
    reply.deletedAt = undefined;
    await em.persistAndFlush(reply);
    return reply;
  }
}
