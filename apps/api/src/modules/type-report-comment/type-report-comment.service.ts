import { Injectable, NotFoundException } from '@nestjs/common';
import { TypeReportCommentRepository } from './type-report-comment.repository';
import {
  TypeReportCommentApiName,
  TypeReportCommentEntity,
} from '@database/entities';
import { TYPE_REPORT_COMMENT_EXCEPTIONS } from './constants';

/**
 * Contém a lógica de negócio para as operações de tipos de denúncia de comentários.
 */
@Injectable()
export class TypeReportCommentService {
  constructor(private readonly repository: TypeReportCommentRepository) {}

  /**
   * Busca um tipo de denúncia de comentário pelo seu nome de API.
   *
   * @param {TypeReportCommentApiName} apiName O nome de API do tipo de denúncia.
   * @returns {Promise<TypeReportCommentEntity>} O tipo de denúncia encontrado.
   * @throws {NotFoundException} Se o tipo de denúncia não for encontrado.
   */
  async getTypeReportCommentByApiName(
    apiName: TypeReportCommentApiName,
  ): Promise<TypeReportCommentEntity> {
    const typeReportComment = await this.repository.findByApiName(apiName);
    if (!typeReportComment) {
      throw new NotFoundException(
        TYPE_REPORT_COMMENT_EXCEPTIONS.TYPE_REPORT_COMMENT_NOT_FOUND,
      );
    }
    return typeReportComment;
  }
}
