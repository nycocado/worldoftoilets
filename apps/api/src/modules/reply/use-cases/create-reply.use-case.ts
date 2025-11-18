import { Injectable } from '@nestjs/common';
import { UserService } from '@modules/user';
import { CommentService } from '@modules/comment';
import { Transactional } from '@mikro-orm/mariadb';
import { ReplyRepository } from '@modules/reply/reply.repository';
import { ReplyResponseDto } from '@modules/reply/dto';
import { plainToInstance } from 'class-transformer';

/**
 * Caso de Uso para Criar Resposta
 *
 * @class CreateReplyUseCase
 * @description Implementa a lógica de criação de nova resposta a um comentário.
 *
 * @implements
 *   - Validação de existência de utilizador e comentário
 *   - Criação de resposta com texto obrigatório
 *
 * @example
 * const reply = await createReplyUseCase.execute(
 *   userId,
 *   'comment-public-id',
 *   'Concordo completamente!'
 * );
 *
 * @see ReplyRepository - Repositório para persistência
 */
@Injectable()
export class CreateReplyUseCase {
  /**
   * Construtor do CreateReplyUseCase
   *
   * @param {ReplyRepository} repository - Repositório de respostas
   * @param {UserService} userService - Serviço para operações de utilizador
   * @param {CommentService} commentService - Serviço para operações de comentário
   */
  constructor(
    private readonly repository: ReplyRepository,
    private readonly userService: UserService,
    private readonly commentService: CommentService,
  ) {}

  /**
   * Executar caso de uso de criar resposta
   *
   * @async
   * @transactional Executa dentro de transação
   * @param {string} userPublicId - ID público do utilizador
   * @param {string} commentPublicId - Identificador público do comentário
   * @param {string} text - Texto da resposta
   * @returns {Promise<ReplyResponseDto>} DTO da resposta criada
   * @throws {NotFoundException} Se utilizador ou comentário não forem encontrados
   *
   * @description
   * 1. Busca utilizador por publicId
   * 2. Busca comentário por publicId
   * 3. Cria resposta com texto
   * 4. Retorna DTO completo da resposta criada
   */
  @Transactional()
  async execute(
    userPublicId: string,
    commentPublicId: string,
    text: string,
  ): Promise<ReplyResponseDto> {
    const user = await this.userService.getUserByPublicId(userPublicId);
    const comment =
      await this.commentService.getCommentByPublicId(commentPublicId);
    const reply = await this.repository.create(comment, user, text);

    return plainToInstance(ReplyResponseDto, reply, {
      excludeExtraneousValues: true,
    });
  }
}
