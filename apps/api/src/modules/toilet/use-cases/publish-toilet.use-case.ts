import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { ToiletRepository } from '@modules/toilet/toilet.repository';
import { UserService } from '@modules/user';
import { TOILET_EXCEPTIONS } from '@modules/toilet/constants/exceptions.constant';
import { ToiletStatus } from '@database/entities';

/**
 * Contém a lógica de negócio para publicar uma casa de banho sugerida.
 */
@Injectable()
export class PublishToiletUseCase {
  constructor(
    private readonly repository: ToiletRepository,
    private readonly userService: UserService,
  ) {}

  /**
   * Publica uma casa de banho, alterando seu status de 'SUGGESTED' para 'ACTIVE'.
   *
   * @param {string} publicId O ID público da casa de banho.
   * @param {string} userPublicId O ID público do utilizador que realiza a publicação.
   * @returns {Promise<void>}
   * @throws {NotFoundException} Se a casa de banho não for encontrada.
   * @throws {ConflictException} Se a casa de banho estiver deletada ou não for uma sugestão.
   */
  @Transactional()
  async execute(publicId: string, userPublicId: string): Promise<void> {
    const toilet = await this.repository.findByPublicId(publicId);

    if (!toilet) {
      throw new NotFoundException(TOILET_EXCEPTIONS.TOILET_NOT_FOUND);
    }

    if (toilet.isDeleted) {
      throw new ConflictException(TOILET_EXCEPTIONS.TOILET_DELETED);
    }

    if (toilet.status !== ToiletStatus.SUGGESTED) {
      throw new ConflictException(TOILET_EXCEPTIONS.TOILET_NOT_SUGGESTED);
    }

    const user = await this.userService.getUserByPublicId(userPublicId);

    await this.repository.publish(toilet, user);
  }
}
