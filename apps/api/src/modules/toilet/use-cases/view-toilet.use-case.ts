import { Injectable, NotFoundException } from '@nestjs/common';
import { ToiletRepository } from '@modules/toilet';
import { UserService } from '@modules/user';
import { InteractionService } from '@modules/interaction';
import { TOILET_EXCEPTIONS } from '@modules/toilet/constants';
import { InteractionDiscriminator } from '@database/entities';
import { Transactional } from '@mikro-orm/mariadb';

/**
 * Contém a lógica de negócio para registrar a visualização de uma casa de banho.
 */
@Injectable()
export class ViewToiletUseCase {
  constructor(
    private readonly repository: ToiletRepository,
    private readonly userService: UserService,
    private readonly interactionService: InteractionService,
  ) {}

  /**
   * Cria uma interação do tipo 'VIEW' para registrar que um utilizador visualizou uma casa de banho.
   *
   * @param {string} toiletPublicId O ID público da casa de banho.
   * @param {string} userPublicId O ID público do utilizador.
   * @returns {Promise<void>}
   * @throws {NotFoundException} Se a casa de banho ou o utilizador não forem encontrados.
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
