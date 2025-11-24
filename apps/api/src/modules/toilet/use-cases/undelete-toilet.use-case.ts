import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { ToiletRepository } from '@modules/toilet/toilet.repository';
import { TOILET_EXCEPTIONS } from '@modules/toilet/constants/exceptions.constant';

/**
 * Contém a lógica de negócio para restaurar uma casa de banho que sofreu soft delete.
 */
@Injectable()
export class UndeleteToiletUseCase {
  constructor(private readonly repository: ToiletRepository) {}

  /**
   * Restaura uma casa de banho que sofreu soft delete.
   *
   * @param {string} publicId O ID público da casa de banho a ser restaurada.
   * @returns {Promise<void>}
   * @throws {NotFoundException} Se a casa de banho não for encontrada.
   * @throws {ConflictException} Se a casa de banho não estiver deletada.
   */
  @Transactional()
  async execute(publicId: string): Promise<void> {
    const toilet = await this.repository.findByPublicId(publicId);

    if (!toilet) {
      throw new NotFoundException(TOILET_EXCEPTIONS.TOILET_NOT_FOUND);
    }

    if (!toilet.isDeleted) {
      throw new ConflictException(TOILET_EXCEPTIONS.TOILET_NOT_DELETED);
    }

    await this.repository.undelete(toilet);
  }
}
