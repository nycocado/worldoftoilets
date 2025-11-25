import { Injectable } from '@nestjs/common';
import { TypeExtraRepository } from './type-extra.repository';
import { TypeExtraApiName, TypeExtraEntity } from '@database/entities';

/**
 * Contém a lógica de negócio para as operações de tipos de extra.
 */
@Injectable()
export class TypeExtraService {
  constructor(private readonly repository: TypeExtraRepository) {}

  /**
   * Busca tipos de extra pelos seus nomes de API.
   *
   * @param {TypeExtraApiName[]} apiNames Os nomes de API dos tipos de extra.
   * @returns {Promise<TypeExtraEntity[]>} Os tipos de extra encontrados.
   */
  async getTypeExtrasByApiNames(
    apiNames: TypeExtraApiName[],
  ): Promise<TypeExtraEntity[]> {
    return await this.repository.find(apiNames);
  }
}
