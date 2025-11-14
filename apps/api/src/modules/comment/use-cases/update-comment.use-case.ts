import { CommentRepository } from '@modules/comment/comment.repository';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommentRateService } from '@modules/comment-rate';
import { Transactional } from '@mikro-orm/mariadb';
import { COMMENT_EXCEPTIONS } from '@modules/comment/constants/exceptions.constant';
import { UserService } from '@modules/user';
import { CommentResponseDto } from '@modules/comment/dto';
import { plainToInstance } from 'class-transformer';

/**
 * Caso de Uso para Atualizar Comentário Próprio
 *
 * @class UpdateCommentUseCase
 * @description Implementa a lógica de atualização de comentário pelo próprio autor.
 * Permite atualizar texto e avaliações do comentário.
 *
 * @implements
 *   - Validação de existência do comentário e avaliação
 *   - Verificação de propriedade (apenas autor pode editar)
 *   - Atualização de texto (opcional)
 *   - Atualização de avaliação (opcional)
 *   - Enriquecimento com dados de reações
 *
 * @example
 * const updated = await updateCommentUseCase.execute(
 *   'comment-public-id',
 *   userId,
 *   'Novo texto',
 *   5, // clean
 *   true, // paper
 *   4, // structure
 *   3 // accessibility
 * );
 *
 * @throws {NotFoundException} Se comentário ou avaliação não existir
 * @throws {UnauthorizedException} Se utilizador não for o autor do comentário
 *
 * @see CommentRepository - Repositório para operações de comentário
 * @see CommentRateService - Serviço para atualização de avaliação
 */
@Injectable()
export class UpdateCommentUseCase {
  /**
   * Construtor do UpdateCommentUseCase
   *
   * @param {CommentRepository} repository - Repositório de comentários
   * @param {CommentRateService} commentRateService - Serviço para operações de avaliação
   * @param {UserService} userService - Serviço para operações de utilizador
   */
  constructor(
    private readonly repository: CommentRepository,
    private readonly commentRateService: CommentRateService,
    private readonly userService: UserService,
  ) {}

  /**
   * Executar caso de uso de atualizar comentário próprio
   *
   * @async
   * @transactional Executa dentro de transação
   * @param {string} commentPublicId - Identificador público do comentário
   * @param {number} userId - ID interno do utilizador (autor)
   * @param {string} text - Novo texto do comentário (opcional)
   * @param {number} clean - Nova avaliação de limpeza (opcional)
   * @param {boolean} paper - Nova disponibilidade de papel (opcional)
   * @param {number} structure - Nova avaliação de estrutura (opcional)
   * @param {number} accessibility - Nova avaliação de acessibilidade (opcional)
   * @returns {Promise<CommentResponseDto>} DTO do comentário atualizado
   * @throws {NotFoundException} Se comentário ou avaliação não existir
   * @throws {UnauthorizedException} Se utilizador não for o autor
   *
   * @description
   * 1. Busca utilizador por ID interno
   * 2. Busca comentário e avaliação por publicId
   * 3. Valida existência do comentário e avaliação
   * 4. Verifica se utilizador é o autor do comentário
   * 5. Atualiza texto se fornecido
   * 6. Atualiza avaliação se fornecida
   * 7. Enriquece comentário com dados de reações
   * 8. Retorna DTO completo do comentário atualizado
   */
  @Transactional()
  async execute(
    commentPublicId: string,
    userId: number,
    text?: string,
    clean?: number,
    paper?: boolean,
    structure?: number,
    accessibility?: number,
  ): Promise<CommentResponseDto> {
    const user = await this.userService.getUserById(userId);
    const comment = await this.repository.findByPublicId(commentPublicId);

    if (!comment || !comment.rate) {
      throw new NotFoundException(COMMENT_EXCEPTIONS.COMMENT_NOT_FOUND);
    }

    if (comment.user.id !== user.id) {
      throw new UnauthorizedException(COMMENT_EXCEPTIONS.COMMENT_NOT_OWNED);
    }

    await this.repository.update(comment, text);

    await this.commentRateService.updateCommentRate(
      comment.rate,
      clean,
      paper,
      structure,
      accessibility,
    );

    return plainToInstance(CommentResponseDto, comment, {
      excludeExtraneousValues: true,
    });
  }
}
