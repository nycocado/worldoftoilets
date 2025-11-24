import { Injectable, NotFoundException } from '@nestjs/common';
import { AccessRepository } from './access.repository';
import { AccessApiName, AccessEntity } from '@database/entities';
import { ACCESS_EXCEPTIONS } from './constants';

/**
 * Contém a lógica de negócio para as operações de acesso.
 */
@Injectable()
export class AccessService {
  constructor(private readonly repository: AccessRepository) {}

  /**
   * Busca um acesso pelo seu nome de API.
   *
   * @param {AccessApiName} apiName O nome da API do acesso a ser buscado.
   * @returns {Promise<AccessEntity>} A entidade de acesso encontrada.
   * @throws {NotFoundException} Se o acesso não for encontrado.
   */
  async getAccessByApiName(apiName: AccessApiName): Promise<AccessEntity> {
    const access = await this.repository.findByApiName(apiName);
    if (!access) {
      throw new NotFoundException(ACCESS_EXCEPTIONS.ACCESS_NOT_FOUND);
    }
    return access;
  }
}
