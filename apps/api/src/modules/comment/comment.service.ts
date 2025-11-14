import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { textTimeToMilliseconds } from '@common/utils/jwt-time.util';
import { ConfigService } from '@nestjs/config';
import { CommentRepository } from '@modules/comment/comment.repository';
import { UserEntity } from '@database/entities';

@Injectable()
export class CommentService {
  constructor(
    private readonly configService: ConfigService,
    private readonly commentRepository: CommentRepository,
  ) {}

  async getCommentsCountsForUser(user: UserEntity): Promise<number> {
    return this.commentRepository.findCommentsCountByUserPublicId(
      user.publicId,
    );
  }

  async getCommentsCountsForUsers(
    users: UserEntity[],
  ): Promise<Map<string, number>> {
    const userPublicIds = users.map((user) => user.publicId);
    return this.commentRepository.findCommentsCountsByUserPublicIds(
      userPublicIds,
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteExpiredComments(): Promise<void> {
    const commentRetention = this.configService.getOrThrow<string>(
      'COMMENT_SOFT_DELETE_RETENTION',
    );
    const retentionMs = textTimeToMilliseconds(commentRetention);
    const retention = new Date(Date.now() - retentionMs);
    return this.commentRepository.deleteExpired(retention);
  }
}
