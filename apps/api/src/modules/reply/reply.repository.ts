import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ReplyEntity } from '@database/entities';
import { EntityRepository } from '@mikro-orm/mariadb';

@Injectable()
export class ReplyRepository {
  constructor(
    @InjectRepository(ReplyEntity)
    private readonly repository: EntityRepository<ReplyEntity>,
  ) {}
}
