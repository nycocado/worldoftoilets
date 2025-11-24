import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { textTimeToMilliseconds } from '@common/utils/jwt-time.util';
import { ConfigService } from '@nestjs/config';
import { CommentRepository } from '@modules/comment/comment.repository';
import { CommentEntity } from '@database/entities';
import { COMMENT_EXCEPTIONS } from '@modules/comment/constants/exceptions.constant';

/**
 * Contém a lógica de negócio para as operações de comentários.
 */
@Injectable()
export class CommentService {
  constructor(
    private readonly configService: ConfigService,
    private readonly commentRepository: CommentRepository,
  ) {}

  /**
   * Remove permanentemente os comentários que excederam o período de retenção do soft delete.
   * Este método é executado como um Cron Job diário.
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteExpiredComments(): Promise<void> {
    const commentRetention = this.configService.getOrThrow<string>(
      'COMMENT_SOFT_DELETE_RETENTION',
    );
    const retentionMs = textTimeToMilliseconds(commentRetention);
    const retention = new Date(Date.now() - retentionMs);
    return this.commentRepository.deleteExpired(retention);
  }

  /**
   * Busca um comentário pelo seu ID público.
   *
   * @param {string} publicId O ID público do comentário.
   * @returns {Promise<CommentEntity>} A entidade do comentário encontrado.
   * @throws {NotFoundException} Se o comentário não for encontrado.
   */
  async getCommentByPublicId(publicId: string): Promise<CommentEntity> {
    const comment = await this.commentRepository.findByPublicId(publicId);
    if (!comment) {
      throw new NotFoundException(COMMENT_EXCEPTIONS.COMMENT_NOT_FOUND);
    }
    return comment;
  }
}
