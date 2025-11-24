import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { ToiletRepository } from '@modules/toilet/toilet.repository';
import { ToiletStatus } from '@database/entities';
import { ToiletResponseDto } from '@modules/toilet/dto';
import { TOILET_EXCEPTIONS } from '@modules/toilet/constants/exceptions.constant';
import { plainToInstance } from 'class-transformer';

/**
 * Contém a lógica de negócio para desativar uma casa de banho.
 */
@Injectable()
export class DisableToiletUseCase {
  constructor(private readonly repository: ToiletRepository) {}

  /**
   * Desativa uma casa de banho, alterando seu status para 'INACTIVE'.
   *
   * @param {string} publicId O ID público da casa de banho.
   * @returns {Promise<ToiletResponseDto>} O DTO da casa de banho atualizado.
   * @throws {NotFoundException} Se a casa de banho não for encontrada.
   * @throws {ConflictException} Se a casa de banho estiver deletada.
   */
  @Transactional()
  async execute(publicId: string): Promise<ToiletResponseDto> {
    const toilet = await this.repository.findByPublicId(publicId);

    if (!toilet) {
      throw new NotFoundException(TOILET_EXCEPTIONS.TOILET_NOT_FOUND);
    }

    if (toilet.isDeleted) {
      throw new ConflictException(TOILET_EXCEPTIONS.TOILET_DELETED);
    }

    if (toilet.status === ToiletStatus.INACTIVE) {
      return plainToInstance(ToiletResponseDto, toilet, {
        excludeExtraneousValues: true,
      });
    }

    await this.repository.changeStatus(toilet, ToiletStatus.INACTIVE);

    return plainToInstance(ToiletResponseDto, toilet, {
      excludeExtraneousValues: true,
    });
  }
}
