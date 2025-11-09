import { Injectable } from '@nestjs/common';
import {
  CommentRateRepository,
  ToiletAverageRating,
} from '@modules/comment-rate/comment-rate.repository';
import {
  CommentEntity,
  CommentRateEntity,
  ToiletEntity,
} from '@database/entities';

@Injectable()
export class CommentRateService {
  constructor(private readonly commentRepository: CommentRateRepository) {}

  async getAverageRatingsByToilet(
    toilet: ToiletEntity,
  ): Promise<ToiletAverageRating | null> {
    return this.commentRepository.findAverageRatingsByToilet(toilet.id);
  }

  async getAverageRatingsForToilets(
    toilets: ToiletEntity[],
  ): Promise<Map<string, ToiletAverageRating>> {
    const toiletPublicIds = toilets.map((toilet) => toilet.publicId);
    return this.commentRepository.findAverageRatingsForToiletsByPublicIds(
      toiletPublicIds,
    );
  }

  async createCommentRate(
    comment: CommentEntity,
    clean: number,
    paper: boolean,
    structure: number,
    accessibility: number,
  ): Promise<CommentRateEntity> {
    return await this.commentRepository.create(
      comment,
      clean,
      paper,
      structure,
      accessibility,
    );
  }

  async updateCommentRate(
    commentRate: CommentRateEntity,
    clean?: number,
    paper?: boolean,
    structure?: number,
    accessibility?: number,
  ): Promise<CommentRateEntity> {
    return await this.commentRepository.update(
      commentRate,
      clean,
      paper,
      structure,
      accessibility,
    );
  }
}
