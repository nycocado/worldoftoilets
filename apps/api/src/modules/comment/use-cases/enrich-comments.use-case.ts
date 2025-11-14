import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CommentEntity } from '@database/entities/comment.entity';
import { CommentResponseDto } from '@modules/comment/dto/comment-response.dto';
import { ReactService } from '@modules/react/react.service';
import { CommentRepository } from '@modules/comment';

/**
 * Caso de Uso para Enriquecer Comentários
 *
 * @class EnrichCommentsUseCase
 * @description Implementa a lógica de enriquecimento de comentários com dados adicionais.
 * Adiciona contagens de reações (likes/dislikes) e contagens de comentários dos utilizadores.
 *
 * @implements
 *   - Conversão de entidades para DTOs
 *   - Busca de contagens de reações por comentário
 *   - Busca de contagens de comentários por utilizador
 *   - Enriquecimento dos DTOs com dados calculados
 *
 * @example
 * const enrichedComments = await enrichCommentsUseCase.execute([comment1, comment2]);
 * // Retorna DTOs com reacts.likes, reacts.dislikes e user.commentsCount preenchidos
 *
 * @see CommentRepository - Repositório para contagem de comentários
 * @see ReactService - Serviço para contagem de reações
 */
@Injectable()
export class EnrichCommentsUseCase {
  /**
   * Construtor do EnrichCommentsUseCase
   *
   * @param {CommentRepository} repository - Repositório de comentários
   * @param {ReactService} reactService - Serviço para operações de reações
   */
  constructor(
    private readonly repository: CommentRepository,
    private readonly reactService: ReactService,
  ) {}

  /**
   * Executar caso de uso de enriquecer comentários
   *
   * @async
   * @param {CommentEntity[]} comments - Array de entidades de comentários
   * @returns {Promise<CommentResponseDto[]>} Array de DTOs enriquecidos
   *
   * @description
   * 1. Busca contagens de reações para todos os comentários em batch
   * 2. Converte entidades para DTOs usando class-transformer
   * 3. Adiciona contagens de likes e dislikes a cada DTO
   * 4. Extrai publicIds únicos de utilizadores
   * 5. Busca contagens de comentários para todos os utilizadores em batch
   * 6. Adiciona contagens de comentários a cada utilizador no DTO
   * 7. Retorna DTOs completos
   * Otimizado para reduzir queries ao banco usando operações em batch.
   */
  async execute(comments: CommentEntity[]): Promise<CommentResponseDto[]> {
    const reacts = await this.reactService.getReactCountsForComments(comments);

    const dto = plainToInstance(CommentResponseDto, comments, {
      excludeExtraneousValues: true,
    });

    dto.forEach((commentDto) => {
      const reactData = reacts.get(commentDto.publicId);
      commentDto.reacts.dislikes = reactData?.dislikes ?? 0;
      commentDto.reacts.likes = reactData?.likes ?? 0;
    });

    const usersPublicIds = [...new Set(comments.map((c) => c.user.publicId))];

    const commentCountsByUsers =
      await this.repository.findCommentsCountsByUserPublicIds(usersPublicIds);

    dto.forEach((comment) => {
      const commentCountForUser = commentCountsByUsers.get(
        comment.user.publicId,
      );
      comment.user.commentsCount = commentCountForUser ?? 0;
    });

    return dto;
  }
}
