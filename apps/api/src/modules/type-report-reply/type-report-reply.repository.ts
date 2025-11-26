import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  TypeReportReplyApiName,
  TypeReportReplyEntity,
} from '@database/entities';
import { EntityRepository } from '@mikro-orm/mariadb';

/**
 * Gerencia o acesso e a persistência de dados para a entidade TypeReportReply.
 */
@Injectable()
export class TypeReportReplyRepository {
  constructor(
    @InjectRepository(TypeReportReplyEntity)
    private readonly repository: EntityRepository<TypeReportReplyEntity>,
  ) {}

  /**
   * Busca um tipo de denúncia de resposta pelo seu nome de API.
   *
   * @param {TypeReportReplyApiName} apiName O nome de API do tipo de denúncia.
   * @returns {Promise<TypeReportReplyEntity | null>} O tipo de denúncia encontrado ou null.
   */
  async findByApiName(
    apiName: TypeReportReplyApiName,
  ): Promise<TypeReportReplyEntity | null> {
    return this.repository.findOne({ apiName });
  }
}
