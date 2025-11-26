import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  TypeReportToiletApiName,
  TypeReportToiletEntity,
} from '@database/entities';
import { EntityRepository } from '@mikro-orm/mariadb';

/**
 * Gerencia o acesso e a persistência de dados para a entidade TypeReportToilet.
 */
@Injectable()
export class TypeReportToiletRepository {
  constructor(
    @InjectRepository(TypeReportToiletEntity)
    private readonly repository: EntityRepository<TypeReportToiletEntity>,
  ) {}

  /**
   * Busca um tipo de denúncia de casa de banho pelo seu nome de API.
   *
   * @param {TypeReportToiletApiName} apiName O nome de API do tipo de denúncia.
   * @returns {Promise<TypeReportToiletEntity | null>} O tipo de denúncia encontrado ou null.
   */
  async findByApiName(
    apiName: TypeReportToiletApiName,
  ): Promise<TypeReportToiletEntity | null> {
    return this.repository.findOne({ apiName });
  }
}
