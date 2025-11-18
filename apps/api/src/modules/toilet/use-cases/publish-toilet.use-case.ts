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
 * Caso de Uso para Publicar um Toilet
 *
 * @class PublishToiletUseCase
 * @description Implementa a lógica de negócio para publicar um toilet que está com o status 'SUGGESTED'.
 * Altera o status para 'ACTIVE' e registra o usuário que realizou a publicação.
 *
 * @implements
 *   - Validação de existência do toilet
 *   - Verificação se o toilet não está deletado
 *   - Verificação se o status atual é 'SUGGESTED'
 *   - Alteração de status para 'ACTIVE'
 *
 * @example
 * await publishToiletUseCase.execute('toilet-public-id', 'user-public-id');
 *
 * @throws {NotFoundException} Se o toilet não for encontrado.
 * @throws {ConflictException} Se o toilet estiver deletado ou não for uma sugestão.
 *
 * @see ToiletRepository
 * @see UserService
 */
@Injectable()
export class PublishToiletUseCase {
  /**
   * Construtor do PublishToiletUseCase
   *
   * @param {ToiletRepository} repository - Repositório para operações de toilet
   * @param {UserService} userService - Serviço para obter dados do usuário
   */
  constructor(
    private readonly repository: ToiletRepository,
    private readonly userService: UserService,
  ) {}

  /**
   * Executa o caso de uso para publicar um toilet.
   *
   * @async
   * @transactional
   * @param {string} publicId - O ID público do toilet a ser publicado.
   * @param {string} userPublicId - O ID público do usuário que está publicando o toilet.
   * @returns {Promise<void>}
   * @throws {NotFoundException} Se o toilet com o ID fornecido não for encontrado.
   * @throws {ConflictException} Se o toilet estiver deletado.
   * @throws {ConflictException} Se o status do toilet não for 'SUGGESTED'.
   *
   * @description
   * 1. Busca o toilet pelo ID público.
   * 2. Lança uma exceção se o toilet não for encontrado.
   * 3. Lança uma exceção se o toilet estiver marcado como deletado.
   * 4. Lança uma exceção se o status do toilet não for 'SUGGESTED'.
   * 5. Busca o usuário que está realizando a publicação.
   * 6. Chama o método do repositório para publicar o toilet, alterando seu status para 'ACTIVE'
   *    e associando o publicador.
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
