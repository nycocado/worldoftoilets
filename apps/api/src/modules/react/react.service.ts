import { Injectable } from '@nestjs/common';
import { ReactRepository } from '@modules/react/react.repository';
import { CommentEntity } from '@database/entities';

@Injectable()
export class ReactService {
  constructor(private readonly reactRepository: ReactRepository) {}

  async getReactCountsByComment(comment: CommentEntity) {
    return this.reactRepository.findReactCountsByComment(comment.id);
  }

  async getReactCountsForComments(comments: CommentEntity[]) {
    const commentsPublicIds = comments.map((comment) => comment.publicId);
    return this.reactRepository.findReactionCountsForCommentsByPublicIds(
      commentsPublicIds,
    );
  }
}
