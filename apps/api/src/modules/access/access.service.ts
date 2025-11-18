import { Injectable, NotFoundException } from '@nestjs/common';
import { AccessRepository } from './access.repository';
import { AccessApiName, AccessEntity } from '@database/entities';
import { ACCESS_EXCEPTIONS } from './constants';

@Injectable()
export class AccessService {
  constructor(private readonly repository: AccessRepository) {}

  async getAccessByApiName(apiName: AccessApiName): Promise<AccessEntity> {
    const access = await this.repository.findByApiName(apiName);
    if (!access) {
      throw new NotFoundException(ACCESS_EXCEPTIONS.ACCESS_NOT_FOUND);
    }
    return access;
  }
}
