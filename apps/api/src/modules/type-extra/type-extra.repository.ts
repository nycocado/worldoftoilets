import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { TypeExtraApiName, TypeExtraEntity } from '@database/entities';
import { EntityRepository } from '@mikro-orm/mariadb';

/**
 * Gerencia o acesso e a persistência de dados para a entidade TypeExtra.
 */
@Injectable()
export class TypeExtraRepository {
  constructor(
    @InjectRepository(TypeExtraEntity)
    private readonly repository: EntityRepository<TypeExtraEntity>,
  ) {}

  /**
   * Busca tipos de extra pelos seus nomes de API.
   *
   * @param {TypeExtraApiName[]} apiNames Os nomes de API dos tipos de extra.
   * @returns {Promise<TypeExtraEntity[]>} Os tipos de extra encontrados.
   */
  async find(apiNames: TypeExtraApiName[]): Promise<TypeExtraEntity[]> {
    return this.repository.find({ apiName: { $in: apiNames } });
  }
}
