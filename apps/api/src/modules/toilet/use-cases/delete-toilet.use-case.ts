import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { ToiletRepository } from '@modules/toilet/toilet.repository';
import { UserService } from '@modules/user';
import { TOILET_EXCEPTIONS } from '@modules/toilet/constants/exceptions.constant';

/**
 * Contém a lógica de negócio para o soft delete de uma casa de banho.
 */
@Injectable()
export class DeleteToiletUseCase {
  constructor(
    private readonly repository: ToiletRepository,
    private readonly userService: UserService,
  ) {}

  /**
   * Realiza o soft delete de uma casa de banho.
   *
   * @param {string} publicId O ID público da casa de banho a ser deletada.
   * @param {string} userPublicId O ID público do utilizador que realiza a deleção.
   * @returns {Promise<void>}
   * @throws {NotFoundException} Se a casa de banho não for encontrada.
   * @throws {ConflictException} Se a casa de banho já estiver deletada.
   */
  @Transactional()
  async execute(publicId: string, userPublicId: string): Promise<void> {
    const toilet = await this.repository.findByPublicId(publicId);

    if (!toilet) {
      throw new NotFoundException(TOILET_EXCEPTIONS.TOILET_NOT_FOUND);
    }

    if (toilet.isDeleted) {
      throw new ConflictException(TOILET_EXCEPTIONS.TOILET_ALREADY_DELETED);
    }

    const user = await this.userService.getUserByPublicId(userPublicId);
    await this.repository.softDelete(toilet, user);
  }
}
