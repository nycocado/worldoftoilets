import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { TypeExtraApiName, TypeExtraEntity } from '@database/entities';
import { EntityRepository } from '@mikro-orm/mariadb';

@Injectable()
export class TypeExtraRepository {
  constructor(
    @InjectRepository(TypeExtraEntity)
    private readonly repository: EntityRepository<TypeExtraEntity>,
  ) {}

  async find(apiNames: TypeExtraApiName[]): Promise<TypeExtraEntity[]> {
    return this.repository.find({ apiName: { $in: apiNames } });
  }
}
