import { Injectable, NotFoundException } from '@nestjs/common';
import { TypeReportReplyRepository } from './type-report-reply.repository';
import {
  TypeReportReplyApiName,
  TypeReportReplyEntity,
} from '@database/entities';
import { TYPE_REPORT_REPLY_EXCEPTIONS } from './constants';

/**
 * Contém a lógica de negócio para as operações de tipos de denúncia de respostas.
 */
@Injectable()
export class TypeReportReplyService {
  constructor(private readonly repository: TypeReportReplyRepository) {}

  /**
   * Busca um tipo de denúncia de resposta pelo seu nome de API.
   *
   * @param {TypeReportReplyApiName} apiName O nome de API do tipo de denúncia.
   * @returns {Promise<TypeReportReplyEntity>} O tipo de denúncia encontrado.
   * @throws {NotFoundException} Se o tipo de denúncia não for encontrado.
   */
  async getTypeReportReplyByApiName(
    apiName: TypeReportReplyApiName,
  ): Promise<TypeReportReplyEntity> {
    const typeReportReply = await this.repository.findByApiName(apiName);
    if (!typeReportReply) {
      throw new NotFoundException(
        TYPE_REPORT_REPLY_EXCEPTIONS.TYPE_REPORT_REPLY_NOT_FOUND,
      );
    }
    return typeReportReply;
  }
}
