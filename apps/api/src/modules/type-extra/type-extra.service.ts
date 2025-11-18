import { Injectable } from '@nestjs/common';
import { TypeExtraRepository } from './type-extra.repository';
import { TypeExtraApiName, TypeExtraEntity } from '@database/entities';

@Injectable()
export class TypeExtraService {
  constructor(private readonly repository: TypeExtraRepository) {}

  async getTypeExtrasByApiNames(
    apiNames: TypeExtraApiName[],
  ): Promise<TypeExtraEntity[]> {
    return await this.repository.find(apiNames);
  }
}
