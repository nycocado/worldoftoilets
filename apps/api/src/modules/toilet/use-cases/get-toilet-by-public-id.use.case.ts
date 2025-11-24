import { Injectable, NotFoundException } from '@nestjs/common';
import { ToiletRepository } from '@modules/toilet';
import { TOILET_EXCEPTIONS } from '@modules/toilet/constants/exceptions.constant';
import { ToiletResponseDto } from '@modules/toilet/dto';
import { plainToInstance } from 'class-transformer';

/**
 * Contém a lógica de negócio para obter os dados de uma casa de banho pelo seu ID público.
 */
@Injectable()
export class GetToiletByPublicIdUseCase {
  constructor(private readonly repository: ToiletRepository) {}

  /**
   * Busca uma casa de banho pelo seu ID público.
   *
   * @param {string} publicId O ID público da casa de banho.
   * @returns {Promise<ToiletResponseDto>} O DTO da casa de banho.
   * @throws {NotFoundException} Se a casa de banho não for encontrada.
   */
  async execute(publicId: string): Promise<ToiletResponseDto> {
    const toilet = await this.repository.findByPublicId(publicId);
    if (!toilet) {
      throw new NotFoundException(TOILET_EXCEPTIONS.TOILET_NOT_FOUND);
    }

    return plainToInstance(ToiletResponseDto, toilet, {
      excludeExtraneousValues: true,
    });
  }
}
