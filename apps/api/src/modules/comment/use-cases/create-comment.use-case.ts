import { Injectable } from '@nestjs/common';
import { UserService } from '@modules/user';
import { ToiletService } from '@modules/toilet/toilet.service';
import { CommentRateService } from '@modules/comment-rate/comment-rate.service';
import { InteractionService } from '@modules/interaction';
import { Transactional } from '@mikro-orm/mariadb';
import { InteractionDiscriminator } from '@database/entities';
import { CommentRepository } from '@modules/comment/comment.repository';
import { CommentResponseDto } from '@modules/comment/dto';
import { EnrichCommentsUseCase } from '@modules/comment/use-cases/enrich-comments.use-case';

/**
 * Caso de Uso para Criar Comentário
 *
 * @class CreateCommentUseCase
 * @description Implementa a lógica de criação de novo comentário em toilet.
 * Cria interação, comentário, avaliação e enriquece com dados de reações.
 *
 * @implements
 *   - Validação de existência de utilizador e toilet
 *   - Criação de interação do tipo COMMENT
 *   - Criação de comentário com texto opcional
 *   - Criação de avaliação (clean, paper, structure, accessibility)
 *   - Enriquecimento com dados de reações do utilizador
 *
 * @example
 * const comment = await createCommentUseCase.execute(
 *   userId,
 *   'toilet-public-id',
 *   4, // clean
 *   true, // paper
 *   5, // structure
 *   3, // accessibility
 *   'Excelente toilet!'
 * );
 *
 * @see CommentRepository - Repositório para persistência
 * @see EnrichCommentsUseCase - Enriquece comentários com reações
 */
@Injectable()
export class CreateCommentUseCase {
  /**
   * Construtor do CreateCommentUseCase
   *
   * @param {CommentRepository} repository - Repositório de comentários
   * @param {UserService} userService - Serviço para operações de utilizador
   * @param {ToiletService} toiletService - Serviço para operações de toilet
   * @param {InteractionService} interactionService - Serviço para criar interações
   * @param {CommentRateService} commentRateService - Serviço para criar avaliações
   * @param {EnrichCommentsUseCase} enrichCommentsWithReactsUseCase - Use case para enriquecer com reações
   */
  constructor(
    private readonly repository: CommentRepository,
    private readonly userService: UserService,
    private readonly toiletService: ToiletService,
    private readonly interactionService: InteractionService,
    private readonly commentRateService: CommentRateService,
    private readonly enrichCommentsWithReactsUseCase: EnrichCommentsUseCase,
  ) {}

  /**
   * Executar caso de uso de criar comentário
   *
   * @async
   * @transactional Executa dentro de transação
   * @param {number} userId - ID interno do utilizador
   * @param {string} toiletPublicId - Identificador público do toilet
   * @param {number} clean - Avaliação de limpeza (1-5)
   * @param {boolean} paper - Disponibilidade de papel higiénico
   * @param {number} structure - Avaliação de estrutura (1-5)
   * @param {number} accessibility - Avaliação de acessibilidade (1-5)
   * @param {string} text - Texto do comentário (opcional)
   * @returns {Promise<CommentResponseDto>} DTO do comentário criado com reações
   * @throws {NotFoundException} Se utilizador ou toilet não forem encontrados
   *
   * @description
   * 1. Busca utilizador por ID interno
   * 2. Busca toilet por publicId
   * 3. Cria interação do tipo COMMENT associando utilizador e toilet
   * 4. Cria comentário com texto opcional
   * 5. Cria avaliação com métricas de qualidade
   * 6. Enriquece comentário com dados de reações do utilizador
   * 7. Retorna DTO completo do comentário criado
   */
  @Transactional()
  async execute(
    userId: number,
    toiletPublicId: string,
    clean: number,
    paper: boolean,
    structure: number,
    accessibility: number,
    text?: string,
  ): Promise<CommentResponseDto> {
    const user = await this.userService.getUserById(userId);
    const toilet = await this.toiletService.getToiletByPublicId(toiletPublicId);
    const interaction = await this.interactionService.createInteraction(
      user,
      toilet,
      InteractionDiscriminator.COMMENT,
    );
    const comment = await this.repository.create(interaction, text);
    await this.commentRateService.createCommentRate(
      comment,
      clean,
      paper,
      structure,
      accessibility,
    );

    const dto = await this.enrichCommentsWithReactsUseCase.execute([comment]);

    return dto[0];
  }
}
