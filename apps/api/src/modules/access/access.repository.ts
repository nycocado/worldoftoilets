import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { AccessApiName, AccessEntity } from '@database/entities';
import { EntityRepository } from '@mikro-orm/mariadb';

@Injectable()
export class AccessRepository {
  constructor(
    @InjectRepository(AccessEntity)
    private readonly repository: EntityRepository<AccessEntity>,
  ) {}

  async findByApiName(apiName: AccessApiName): Promise<AccessEntity | null> {
    return this.repository.findOne({ apiName });
  }
}
