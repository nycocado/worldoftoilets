import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ToiletEntity } from '@database/entities';
import { EntityRepository } from '@mikro-orm/mariadb';

@Injectable()
export class ToiletRepository {
  constructor(
    @InjectRepository(ToiletEntity)
    private readonly repository: EntityRepository<ToiletEntity>,
  ) {}

  async findByPublicId(publicId: string): Promise<ToiletEntity | null> {
    return this.repository.findOne({ publicId });
  }
}
