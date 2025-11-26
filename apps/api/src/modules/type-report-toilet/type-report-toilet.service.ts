import { Injectable, NotFoundException } from '@nestjs/common';
import { TypeReportToiletRepository } from './type-report-toilet.repository';
import {
  TypeReportToiletApiName,
  TypeReportToiletEntity,
} from '@database/entities';
import { TYPE_REPORT_TOILET_EXCEPTIONS } from './constants';

/**
 * Contém a lógica de negócio para as operações de tipos de denúncia de casas de banho.
 */
@Injectable()
export class TypeReportToiletService {
  constructor(private readonly repository: TypeReportToiletRepository) {}

  /**
   * Busca um tipo de denúncia de casa de banho pelo seu nome de API.
   *
   * @param {TypeReportToiletApiName} apiName O nome de API do tipo de denúncia.
   * @returns {Promise<TypeReportToiletEntity>} O tipo de denúncia encontrado.
   * @throws {NotFoundException} Se o tipo de denúncia não for encontrado.
   */
  async getTypeReportToiletByApiName(
    apiName: TypeReportToiletApiName,
  ): Promise<TypeReportToiletEntity> {
    const typeReportToilet = await this.repository.findByApiName(apiName);
    if (!typeReportToilet) {
      throw new NotFoundException(
        TYPE_REPORT_TOILET_EXCEPTIONS.TYPE_REPORT_TOILET_NOT_FOUND,
      );
    }
    return typeReportToilet;
  }
}
