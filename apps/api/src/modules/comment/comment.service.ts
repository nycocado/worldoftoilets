import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CommentEntity } from '@database/entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: EntityRepository<CommentEntity>,
  ) {}

  async getComments() {
    return this.commentRepository.findAll({
      populate: ['interaction.user', 'rate'],
    });
  }
}
