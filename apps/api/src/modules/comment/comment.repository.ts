import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  CommentEntity,
  CommentState,
  InteractionDiscriminator,
  InteractionEntity,
  ToiletEntity,
  UserEntity,
} from '@database/entities';
import {
  EntityRepository,
  QueryOrder,
  Transactional,
} from '@mikro-orm/mariadb';

/**
 * Repositório de Comentários
 *
 * @class CommentRepository
 * @description Repositório de acesso a dados para entidade CommentEntity.
 * Oferece operações CRUD e queries complexas para comentários, incluindo:
 * - Busca por publicId, toilet ou utilizador
 * - Operações transacionais de criação, atualização e remoção
 * - Gestão de soft delete e estados de comentários
 * - Queries com paginação e ordenação
 *
 * @implements
 *   - Padrão Repository para isolar lógica de acesso a dados
 *   - Transações com decorator @Transactional do MikroORM
 *   - Queries SQL nativas otimizadas para contagens
 *   - Soft delete com período de retenção
 *
 * @see CommentEntity - Entidade de domínio representando comentários
 */
@Injectable()
export class CommentRepository {
  /**
   * Construtor do CommentRepository
   *
   * @param {EntityRepository<CommentEntity>} commentRepository - Repositório MikroORM injetado
   */
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: EntityRepository<CommentEntity>,
  ) {}

  /**
   * Buscar comentário por publicId
   *
   * @async
   * @param {string} publicId - Identificador público único do comentário
   * @returns {Promise<CommentEntity | null>} Comentário encontrado ou null
   *
   * @description
   * Busca um comentário pelo seu publicId (UUID).
   * Carrega automaticamente o utilizador da interação e a avaliação (rate).
   */
  async findByPublicId(publicId: string): Promise<CommentEntity | null> {
    return this.commentRepository.findOne(
      { publicId: publicId },
      { populate: ['interaction.user', 'rate'] },
    );
  }

  /**
   * Buscar comentários por toilet
   *
   * @async
   * @param {ToiletEntity} toilet - Entidade de toilet
   * @param {boolean} pageable - Se deve aplicar paginação
   * @param {number} page - Número da página (zero-indexed)
   * @param {number} size - Tamanho da página
   * @param {CommentState} commentState - Estado dos comentários a buscar (VISIBLE, HIDDEN, etc)
   * @param {Date} timestamp - Data limite para buscar comentários (comentários criados antes desta data)
   * @returns {Promise<CommentEntity[]>} Lista de comentários
   *
   * @description
   * Busca comentários de um toilet específico com suporte a paginação.
   * Filtra por estado do comentário e timestamp de criação.
   * Carrega automaticamente utilizador (com partner), e avaliação (rate).
   * Ordenado por data de criação descendente (mais recentes primeiro).
   */
  async findByToilet(
    toilet: ToiletEntity,
    pageable?: boolean,
    page?: number,
    size?: number,
    commentState?: CommentState,
    timestamp?: Date,
  ): Promise<CommentEntity[]> {
    return this.commentRepository.find(
      {
        state: commentState,
        interaction: {
          discriminator: InteractionDiscriminator.COMMENT,
          toilet: toilet,
        },
        createdAt: { $lte: timestamp },
      },
      {
        populate: ['interaction.user.partner', 'rate'],
        limit: pageable ? size : undefined,
        offset: pageable && page && size ? page * size : undefined,
        orderBy: { createdAt: QueryOrder.DESC },
      },
    );
  }

  /**
   * Buscar comentários por utilizador
   *
   * @async
   * @param {UserEntity} user - Entidade de utilizador
   * @param {boolean} pageable - Se deve aplicar paginação
   * @param {number} page - Número da página (zero-indexed)
   * @param {number} size - Tamanho da página
   * @param {CommentState} commentState - Estado dos comentários a buscar (VISIBLE, HIDDEN, etc)
   * @param {Date} timestamp - Data limite para buscar comentários (comentários criados antes desta data)
   * @returns {Promise<CommentEntity[]>} Lista de comentários
   *
   * @description
   * Busca comentários de um utilizador específico com suporte a paginação.
   * Filtra por estado do comentário e timestamp de criação.
   * Carrega automaticamente o toilet associado e a avaliação (rate).
   * Ordenado por data de criação descendente (mais recentes primeiro).
   */
  async findByUser(
    user: UserEntity,
    pageable?: boolean,
    page?: number,
    size?: number,
    commentState?: CommentState,
    timestamp?: Date,
  ): Promise<CommentEntity[]> {
    return this.commentRepository.find(
      {
        state: commentState,
        interaction: {
          discriminator: InteractionDiscriminator.COMMENT,
          user: user,
        },
        createdAt: { $lte: timestamp },
      },
      {
        populate: ['interaction.toilet', 'rate'],
        limit: pageable ? size : undefined,
        offset: pageable && page && size ? page * size : undefined,
        orderBy: { createdAt: QueryOrder.DESC },
      },
    );
  }

  /**
   * Buscar comentários expirados
   *
   * @async
   * @param {Date} retention - Data de retenção limite
   * @returns {Promise<CommentEntity[]>} Lista de comentários expirados
   *
   * @description
   * Busca comentários soft-deleted há mais tempo que o período de retenção.
   * Usado pelo cron job de limpeza para remover comentários permanentemente.
   */
  async findExpired(retention: Date): Promise<CommentEntity[]> {
    return this.commentRepository.find({
      deletedAt: {
        $lte: retention,
      },
    });
  }

  /**
   * Criar novo comentário
   *
   * @async
   * @transactional Executa dentro de transação
   * @param {InteractionEntity} interaction - Entidade de interação associada
   * @param {string} text - Texto do comentário (opcional)
   * @returns {Promise<CommentEntity>} Comentário criado
   *
   * @description
   * Cria novo comentário associado a uma interação.
   * Persiste imediatamente no banco de dados (flush).
   * Texto é opcional - comentários podem ter apenas avaliação sem texto.
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
    await em.persistAndFlush(comment);
    return comment;
  }

  /**
   * Soft delete de comentário
   *
   * @async
   * @transactional Executa dentro de transação
   * @param {CommentEntity} comment - Comentário a ser marcado como deletado
   * @param {UserEntity} deletedBy - Utilizador que deletou o comentário
   * @returns {Promise<CommentEntity>} Comentário atualizado
   *
   * @description
   * Marca comentário como deletado sem remover do banco de dados.
   * Altera estado para HIDDEN, registra quem deletou e timestamp.
   * Comentário pode ser recuperado com undelete antes de expirar.
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
    await em.persistAndFlush(comment);
    return comment;
  }

  /**
   * Deletar comentário permanentemente
   *
   * @async
   * @transactional Executa dentro de transação
   * @param {CommentEntity} comment - Comentário a ser removido
   * @returns {Promise<void>}
   *
   * @description
   * Remove comentário permanentemente do banco de dados.
   * Operação irreversível - normalmente usado apenas pelo cron job de limpeza.
   */
  @Transactional()
  async delete(comment: CommentEntity): Promise<void> {
    const em = this.commentRepository.getEntityManager();
    await em.removeAndFlush(comment);
  }

  /**
   * Deletar comentários expirados permanentemente
   *
   * @async
   * @transactional Executa dentro de transação
   * @param {Date} retention - Data de retenção limite
   * @returns {Promise<void>}
   *
   * @description
   * Remove permanentemente todos os comentários soft-deleted há mais tempo que o período de retenção.
   * Chamado pelo cron job diário de limpeza.
   * Operação em batch para eficiência.
   */
  @Transactional()
  async deleteExpired(retention: Date): Promise<void> {
    const em = this.commentRepository.getEntityManager();
    const comments = await this.findExpired(retention);
    await em.removeAndFlush(comments);
  }

  /**
   * Atualizar comentário
   *
   * @async
   * @transactional Executa dentro de transação
   * @param {CommentEntity} comment - Comentário a ser atualizado
   * @param {string} text - Novo texto do comentário (opcional)
   * @returns {Promise<CommentEntity>} Comentário atualizado
   *
   * @description
   * Atualiza texto do comentário se fornecido.
   * Se text for undefined, nenhuma alteração é feita ao texto.
   * Persiste mudanças imediatamente no banco de dados.
   */
  @Transactional()
  async update(comment: CommentEntity, text?: string): Promise<CommentEntity> {
    const em = this.commentRepository.getEntityManager();
    if (text !== undefined) {
      comment.text = text;
    }
    await em.persistAndFlush(comment);
    return comment;
  }

  /**
   * Alterar estado do comentário
   *
   * @async
   * @transactional Executa dentro de transação
   * @param {CommentEntity} comment - Comentário a ser atualizado
   * @param {CommentState} state - Novo estado (VISIBLE ou HIDDEN)
   * @returns {Promise<CommentEntity>} Comentário atualizado
   *
   * @description
   * Altera estado de visibilidade do comentário.
   * Usado por operações de moderação (hide/show).
   * Persiste mudanças imediatamente no banco de dados.
   */
  @Transactional()
  async changeState(
    comment: CommentEntity,
    state: CommentState,
  ): Promise<CommentEntity> {
    const em = this.commentRepository.getEntityManager();
    comment.state = state;
    await em.persistAndFlush(comment);
    return comment;
  }

  /**
   * Recuperar comentário deletado
   *
   * @async
   * @transactional Executa dentro de transação
   * @param {CommentEntity} comment - Comentário a ser recuperado
   * @returns {Promise<CommentEntity>} Comentário restaurado
   *
   * @description
   * Reverte soft delete de comentário.
   * Restaura estado para VISIBLE e limpa campos deletedBy e deletedAt.
   * Apenas funciona para comentários soft-deleted que ainda não foram removidos permanentemente.
   */
  @Transactional()
  async undelete(comment: CommentEntity): Promise<CommentEntity> {
    const em = this.commentRepository.getEntityManager();
    comment.state = CommentState.VISIBLE;
    comment.deletedBy = undefined;
    comment.deletedAt = undefined;
    await em.persistAndFlush(comment);
    return comment;
  }
}
