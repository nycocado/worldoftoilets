import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  TypeReportUserApiName,
  TypeReportUserEntity,
} from '@database/entities';
import { EntityRepository } from '@mikro-orm/mariadb';

/**
 * Gerencia o acesso e a persistência de dados para a entidade TypeReportUser.
 */
@Injectable()
export class TypeReportUserRepository {
  constructor(
    @InjectRepository(TypeReportUserEntity)
    private readonly repository: EntityRepository<TypeReportUserEntity>,
  ) {}

  /**
   * Busca um tipo de denúncia de utilizador pelo seu nome de API.
   *
   * @param {TypeReportUserApiName} apiName O nome de API do tipo de denúncia.
   * @returns {Promise<TypeReportUserEntity | null>} O tipo de denúncia encontrado ou null.
   */
  async findByApiName(
    apiName: TypeReportUserApiName,
  ): Promise<TypeReportUserEntity | null> {
    return this.repository.findOne({ apiName });
  }
}
