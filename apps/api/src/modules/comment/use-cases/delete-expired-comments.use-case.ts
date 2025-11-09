import { CommentRepository } from '@modules/comment/comment.repository';
import { Injectable } from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';

@Injectable()
export class DeleteExpiredCommentsUseCase {
  constructor(private readonly commentRepository: CommentRepository) {}

  @Transactional()
  async execute(retention: Date): Promise<void> {
    return this.commentRepository.deleteExpired(retention);
  }
}
