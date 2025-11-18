import { Injectable, NotFoundException } from '@nestjs/common';
import { ToiletRepository } from '@modules/toilet';
import { TOILET_EXCEPTIONS } from '@modules/toilet/constants/exceptions.constant';
import { ToiletResponseDto } from '@modules/toilet/dto';
import { plainToInstance } from 'class-transformer';

/**
 * Caso de Uso para Obter Toilet por ID Público
 *
 * @class GetToiletByPublicIdUseCase
 * @description Implementa a lógica de obtenção de toilet por ID público (UUID).
 * Busca toilet no repositório e transforma em DTO de resposta.
 *
 * @implements
 *   - Validação de existência de toilet
 *   - Busca por ID público (UUID)
 *   - Transformação de entidade para DTO
 *
 * @example
 * const toilet = await getToiletByPublicIdUseCase.execute(
 *   '550e8400-e29b-41d4-a716-446655440000'
 * );
 *
 * @see ToiletRepository - Repositório para busca de dados
 */
@Injectable()
export class GetToiletByPublicIdUseCase {
  /**
   * Construtor do GetToiletByPublicIdUseCase
   *
   * @param {ToiletRepository} repository - Repositório de toilets
   */
  constructor(private readonly repository: ToiletRepository) {}

  /**
   * Executar caso de uso de obter toilet por ID público
   *
   * @async
   * @param {string} publicId - ID público UUID do toilet
   * @returns {Promise<ToiletResponseDto>} DTO do toilet encontrado
   * @throws {NotFoundException} Se toilet não for encontrado
   *
   * @description
   * 1. Busca toilet por publicId no repositório
   * 2. Se não encontrado, lança NotFoundException
   * 3. Transforma entidade em ToiletResponseDto
   * 4. Retorna DTO com dados completos do toilet (access, extras, ratings)
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
