import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { AccessApiName, AccessEntity } from '@database/entities';
import { EntityRepository } from '@mikro-orm/mariadb';

/**
 * Gerencia o acesso e a persistência de dados para a entidade Access.
 */
@Injectable()
export class AccessRepository {
  constructor(
    @InjectRepository(AccessEntity)
    private readonly repository: EntityRepository<AccessEntity>,
  ) {}

  /**
   * Busca um acesso pelo seu nome de API.
   *
   * @param {AccessApiName} apiName O nome da API do acesso a ser buscado.
   * @returns {Promise<AccessEntity | null>} A entidade de acesso ou `null` se não for encontrada.
   */
  async findByApiName(apiName: AccessApiName): Promise<AccessEntity | null> {
    return this.repository.findOne({ apiName });
  }
}
