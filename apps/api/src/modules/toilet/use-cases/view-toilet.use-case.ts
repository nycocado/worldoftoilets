import { Injectable, NotFoundException } from '@nestjs/common';
import { ToiletRepository } from '@modules/toilet';
import { UserService } from '@modules/user';
import { InteractionService } from '@modules/interaction';
import { TOILET_EXCEPTIONS } from '@modules/toilet/constants';
import { InteractionDiscriminator } from '@database/entities';
import { Transactional } from '@mikro-orm/mariadb';

/**
 * Caso de Uso para Registrar a Visualização de um Toilet
 *
 * @class ViewToiletUseCase
 * @description Implementa a lógica de negócio para registrar quando um usuário visualiza um toilet.
 * Isso é feito criando uma interação do tipo 'VIEW'.
 *
 * @implements
 *   - Validação de existência do usuário e do toilet
 *   - Prevenção de visualização de toilets deletados
 *   - Criação de uma interação de visualização
 *
 * @example
 * await viewToiletUseCase.execute('toilet-public-id', 'user-public-id');
 *
 * @throws {NotFoundException} Se o usuário ou o toilet não forem encontrados, ou se o toilet estiver deletado.
 *
 * @see ToiletRepository
 * @see UserService
 * @see InteractionService
 */
@Injectable()
export class ViewToiletUseCase {
  /**
   * Construtor do ViewToiletUseCase
   *
   * @param {ToiletRepository} repository - Repositório para operações de toilet
   * @param {UserService} userService - Serviço para obter dados do usuário
   * @param {InteractionService} interactionService - Serviço para criar interações
   */
  constructor(
    private readonly repository: ToiletRepository,
    private readonly userService: UserService,
    private readonly interactionService: InteractionService,
  ) {}

  /**
   * Executa o caso de uso para registrar a visualização de um toilet.
   *
   * @async
   * @transactional
   * @param {string} toiletPublicId - O ID público do toilet que foi visualizado.
   * @param {string} userPublicId - O ID público do usuário que visualizou o toilet.
   * @returns {Promise<void>}
   * @throws {NotFoundException} Se o usuário não for encontrado.
   * @throws {NotFoundException} Se o toilet não for encontrado.
   * @throws {NotFoundException} Se o toilet estiver deletado.
   *
   * @description
   * 1. Busca o usuário e o toilet pelos seus IDs públicos.
   * 2. Lança uma exceção se qualquer um deles não for encontrado ou se o toilet estiver deletado.
   * 3. Cria uma nova interação do tipo 'VIEW' para registrar o evento.
   */
  @Transactional()
  async execute(toiletPublicId: string, userPublicId: string): Promise<void> {
    const user = await this.userService.getUserByPublicId(userPublicId);
    const toilet = await this.repository.findByPublicId(toiletPublicId);

    if (!toilet) {
      throw new NotFoundException(TOILET_EXCEPTIONS.TOILET_NOT_FOUND);
    }

    if (toilet.isDeleted) {
      throw new NotFoundException(TOILET_EXCEPTIONS.TOILET_DELETED);
    }

    await this.interactionService.createInteraction(
      user,
      toilet,
      InteractionDiscriminator.VIEW,
    );
  }
}
