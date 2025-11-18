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
 * Caso de Uso para Deletar um Toilet
 *
 * @class DeleteToiletUseCase
 * @description Implementa a lógica de negócio para realizar o soft delete de um toilet.
 * Verifica se o toilet existe, não está já deletado e não é uma sugestão antes de deletar.
 *
 * @implements
 *   - Validação de existência do toilet
 *   - Prevenção de dupla deleção
 *   - Restrição de deleção para toilets sugeridos
 *   - Realização de soft delete
 *
 * @example
 * await deleteToiletUseCase.execute('toilet-public-id', 'user-public-id');
 *
 * @throws {NotFoundException} Se o toilet não for encontrado.
 * @throws {ConflictException} Se o toilet já estiver deletado ou for uma sugestão.
 *
 * @see ToiletRepository
 * @see UserService
 */
@Injectable()
export class DeleteToiletUseCase {
  /**
   * Construtor do DeleteToiletUseCase
   *
   * @param {ToiletRepository} repository - Repositório para operações de toilet
   * @param {UserService} userService - Serviço para obter dados do usuário
   */
  constructor(
    private readonly repository: ToiletRepository,
    private readonly userService: UserService,
  ) {}

  /**
   * Executa o caso de uso para deletar um toilet.
   *
   * @async
   * @transactional
   * @param {string} publicId - O ID público do toilet a ser deletado.
   * @param {string} userPublicId - O ID público do usuário que está realizando a deleção.
   * @returns {Promise<void>}
   * @throws {NotFoundException} Se o toilet com o ID fornecido não for encontrado.
   * @throws {ConflictException} Se o toilet já estiver deletado.
   * @throws {ConflictException} Se o toilet for uma sugestão e não puder ser deletado.
   *
   * @description
   * 1. Busca o toilet pelo ID público.
   * 2. Lança uma exceção se o toilet não for encontrado.
   * 3. Lança uma exceção se o toilet já estiver marcado como deletado.
   * 4. Lança uma exceção se o toilet tiver o status de 'sugerido'.
   * 5. Busca o usuário que está realizando a deleção.
   * 6. Realiza o soft delete do toilet, registrando quem o deletou.
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
