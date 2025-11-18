import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { ToiletRepository } from '@modules/toilet/toilet.repository';
import { TOILET_EXCEPTIONS } from '@modules/toilet/constants/exceptions.constant';

/**
 * Caso de Uso para Restaurar um Toilet
 *
 * @class UndeleteToiletUseCase
 * @description Implementa a lógica de negócio para restaurar um toilet que sofreu soft delete.
 *
 * @implements
 *   - Validação de existência do toilet
 *   - Verificação se o toilet não está deletado (para evitar restauração desnecessária)
 *   - Restauração do toilet (remover marcação de soft delete)
 *
 * @example
 * await undeleteToiletUseCase.execute('toilet-public-id');
 *
 * @throws {NotFoundException} Se o toilet não for encontrado.
 * @throws {ConflictException} Se o toilet não estiver deletado.
 *
 * @see ToiletRepository
 */
@Injectable()
export class UndeleteToiletUseCase {
  /**
   * Construtor do UndeleteToiletUseCase
   *
   * @param {ToiletRepository} repository - Repositório para operações de toilet
   */
  constructor(private readonly repository: ToiletRepository) {}

  /**
   * Executa o caso de uso para restaurar um toilet.
   *
   * @async
   * @transactional
   * @param {string} publicId - O ID público do toilet a ser restaurado.
   * @returns {Promise<void>}
   * @throws {NotFoundException} Se o toilet com o ID fornecido não for encontrado.
   * @throws {ConflictException} Se o toilet não estiver deletado, não podendo ser restaurado.
   *
   * @description
   * 1. Busca o toilet pelo ID público.
   * 2. Lança uma exceção se o toilet não for encontrado.
   * 3. Lança uma exceção se o toilet não estiver marcado como deletado.
   * 4. Chama o método do repositório para remover a marcação de soft delete do toilet.
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
