import { Injectable } from '@nestjs/common';
import { ReactRepository } from '@modules/react/react.repository';
import {
  CommentEntity,
  ReactDiscriminator,
  ReactEntity,
  UserEntity,
} from '@database/entities';

@Injectable()
export class ReactService {
  constructor(private readonly reactRepository: ReactRepository) {}

  async getReactByUserAndComment(user: UserEntity, comment: CommentEntity) {
    return this.reactRepository.findByUserAndComment(user.id, comment.id);
  }

  async getReactCountsByComment(comment: CommentEntity) {
    return this.reactRepository.findReactCountsByComment(comment.id);
  }

  async getReactCountsForComments(comments: CommentEntity[]) {
    const commentsPublicIds = comments.map((comment) => comment.publicId);
    return this.reactRepository.findReactionCountsForCommentsByPublicIds(
      commentsPublicIds,
    );
  }

  async createReact(
    user: UserEntity,
    comment: CommentEntity,
    discriminator: ReactDiscriminator,
  ) {
    return this.reactRepository.create(user, comment, discriminator);
  }

  async updateReact(react: ReactEntity, discriminator: ReactDiscriminator) {
    return this.reactRepository.update(react, discriminator);
  }

  async deleteReact(react: ReactEntity) {
    return this.reactRepository.delete(react);
  }
}
