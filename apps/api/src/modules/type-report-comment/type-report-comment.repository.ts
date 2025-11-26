import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  TypeReportCommentApiName,
  TypeReportCommentEntity,
} from '@database/entities';
import { EntityRepository } from '@mikro-orm/mariadb';

/**
 * Gerencia o acesso e a persistência de dados para a entidade TypeReportComment.
 */
@Injectable()
export class TypeReportCommentRepository {
  constructor(
    @InjectRepository(TypeReportCommentEntity)
    private readonly repository: EntityRepository<TypeReportCommentEntity>,
  ) {}

  /**
   * Busca um tipo de denúncia de comentário pelo seu nome de API.
   *
   * @param {TypeReportCommentApiName} apiName O nome de API do tipo de denúncia.
   * @returns {Promise<TypeReportCommentEntity | null>} O tipo de denúncia encontrado ou null.
   */
  async findByApiName(
    apiName: TypeReportCommentApiName,
  ): Promise<TypeReportCommentEntity | null> {
    return this.repository.findOne({ apiName });
  }
}
