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
 * Caso de Uso para Ativar um Toilet
 *
 * @class EnableToiletUseCase
 * @description Implementa a lógica de negócio para ativar um toilet, alterando seu status para ACTIVE.
 * É idempotente; se o toilet já estiver ativo, retorna o estado atual sem erro.
 *
 * @implements
 *   - Validação de existência do toilet
 *   - Prevenção de ativação de toilets deletados
 *   - Alteração de status para ACTIVE
 *   - Idempotência na operação
 *
 * @example
 * const toilet = await enableToiletUseCase.execute('toilet-public-id');
 *
 * @throws {NotFoundException} Se o toilet não for encontrado.
 * @throws {ConflictException} Se o toilet estiver deletado.
 *
 * @see ToiletRepository
 */
@Injectable()
export class EnableToiletUseCase {
  /**
   * Construtor do EnableToiletUseCase
   *
   * @param {ToiletRepository} repository - Repositório para operações de toilet
   */
  constructor(private readonly repository: ToiletRepository) {}

  /**
   * Executa o caso de uso para ativar um toilet.
   *
   * @async
   * @transactional
   * @param {string} publicId - O ID público do toilet a ser ativado.
   * @returns {Promise<ToiletResponseDto>} O DTO do toilet atualizado.
   * @throws {NotFoundException} Se o toilet com o ID fornecido não for encontrado.
   * @throws {ConflictException} Se o toilet estiver deletado e não puder ser modificado.
   *
   * @description
   * 1. Busca o toilet pelo ID público.
   * 2. Lança uma exceção se o toilet não for encontrado.
   * 3. Lança uma exceção se o toilet estiver marcado como deletado.
   * 4. Se o toilet já estiver ACTIVE, retorna o DTO sem fazer alterações (idempotência).
   * 5. Altera o status do toilet para ACTIVE.
   * 6. Retorna o toilet atualizado como um DTO.
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

    if (toilet.status === ToiletStatus.ACTIVE) {
      return plainToInstance(ToiletResponseDto, toilet, {
        excludeExtraneousValues: true,
      });
    }

    await this.repository.changeStatus(toilet, ToiletStatus.ACTIVE);

    return plainToInstance(ToiletResponseDto, toilet, {
      excludeExtraneousValues: true,
    });
  }
}
