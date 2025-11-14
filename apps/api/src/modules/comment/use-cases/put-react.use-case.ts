import { ReactService } from '@modules/react';
import { UserService } from '@modules/user';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ReactDiscriminator } from '@database/entities';
import { CommentResponseDto } from '@modules/comment/dto';
import { CommentRepository } from '@modules/comment/comment.repository';
import { COMMENT_EXCEPTIONS } from '@modules/comment/constants/exceptions.constant';
import { plainToInstance } from 'class-transformer';
import { EnrichCommentsUseCase } from '@modules/comment/use-cases/enrich-comments.use-case';

/**
 * Caso de Uso para Reagir a Comentário
 *
 * @class PutReactUseCase
 * @description Implementa a lógica de adicionar, remover ou alterar reação (like/dislike) em comentário.
 * Segue padrão idempotente: executar mesma reação remove-a, reação diferente substitui-a.
 *
 * @implements
 *   - Validação de existência do comentário
 *   - Busca de reação existente do utilizador
 *   - Criação de nova reação se não existir
 *   - Remoção de reação se for igual (toggle)
 *   - Substituição de reação se for diferente (like <-> dislike)
 *   - Enriquecimento com dados atualizados de reações
 *
 * @example
 * const comment = await putReactUseCase.execute(
 *   userId,
 *   'comment-public-id',
 *   ReactDiscriminator.LIKE
 * );
 * // Primeira chamada: adiciona like
 * // Segunda chamada: remove like
 *
 * @throws {NotFoundException} Se comentário não existir
 *
 * @see ReactService - Serviço para gestão de reações
 * @see EnrichCommentsUseCase - Enriquece comentário com reações atualizadas
 */
@Injectable()
export class PutReactUseCase {
  /**
   * Construtor do PutReactUseCase
   *
   * @param {CommentRepository} repository - Repositório de comentários
   * @param {UserService} userService - Serviço para operações de utilizador
   * @param {ReactService} reactService - Serviço para operações de reações
   * @param {EnrichCommentsUseCase} enrichCommentsWithReactsUseCase - Use case para enriquecer com reações
   */
  constructor(
    private readonly repository: CommentRepository,
    private readonly userService: UserService,
    private readonly reactService: ReactService,
    private readonly enrichCommentsWithReactsUseCase: EnrichCommentsUseCase,
  ) {}

  /**
   * Executar caso de uso de reagir a comentário
   *
   * @async
   * @param {number} userId - ID interno do utilizador
   * @param {string} commentPublicId - Identificador público do comentário
   * @param {ReactDiscriminator} discriminator - Tipo de reação (LIKE ou DISLIKE)
   * @returns {Promise<CommentResponseDto>} DTO do comentário com reações atualizadas
   * @throws {NotFoundException} Se comentário não existir
   *
   * @description
   * 1. Busca utilizador por ID interno
   * 2. Busca comentário por publicId
   * 3. Valida existência do comentário
   * 4. Busca reação existente do utilizador no comentário
   * 5. Se não houver reação: cria nova reação
   * 6. Se houver reação igual: remove reação (toggle off)
   * 7. Se houver reação diferente: substitui por nova reação
   * 8. Enriquece comentário com contagens atualizadas de reações
   * 9. Retorna DTO completo do comentário
   * Comportamento idempotente para facilitar uso em interfaces.
   */
  async execute(
    userId: number,
    commentPublicId: string,
    discriminator: ReactDiscriminator,
  ): Promise<CommentResponseDto> {
    const user = await this.userService.getUserById(userId);
    const comment = await this.repository.findByPublicId(commentPublicId);

    if (!comment) {
      throw new NotFoundException(COMMENT_EXCEPTIONS.COMMENT_NOT_FOUND);
    }

    const react = await this.reactService.getReactByUserAndComment(
      user,
      comment,
    );

    if (!react) {
      await this.reactService.createReact(user, comment, discriminator);
    }

    if (react && react.discriminator === discriminator) {
      await this.reactService.deleteReact(react);
    }

    if (react && react.discriminator !== discriminator) {
      await this.reactService.updateReact(react, discriminator);
    }

    const dto = await this.enrichCommentsWithReactsUseCase.execute([comment]);

    return dto[0];
  }
}
