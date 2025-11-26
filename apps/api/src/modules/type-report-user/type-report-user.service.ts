import { Injectable, NotFoundException } from '@nestjs/common';
import { TypeReportUserRepository } from './type-report-user.repository';
import {
  TypeReportUserApiName,
  TypeReportUserEntity,
} from '@database/entities';
import { TYPE_REPORT_USER_EXCEPTIONS } from './constants';

/**
 * Contém a lógica de negócio para as operações de tipos de denúncia de utilizadores.
 */
@Injectable()
export class TypeReportUserService {
  constructor(private readonly repository: TypeReportUserRepository) {}

  /**
   * Busca um tipo de denúncia de utilizador pelo seu nome de API.
   *
   * @param {TypeReportUserApiName} apiName O nome de API do tipo de denúncia.
   * @returns {Promise<TypeReportUserEntity>} O tipo de denúncia encontrado.
   * @throws {NotFoundException} Se o tipo de denúncia não for encontrado.
   */
  async getTypeReportUserByApiName(
    apiName: TypeReportUserApiName,
  ): Promise<TypeReportUserEntity> {
    const typeReportUser = await this.repository.findByApiName(apiName);
    if (!typeReportUser) {
      throw new NotFoundException(
        TYPE_REPORT_USER_EXCEPTIONS.TYPE_REPORT_USER_NOT_FOUND,
      );
    }
    return typeReportUser;
  }
}
