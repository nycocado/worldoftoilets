import { Module } from '@nestjs/common';
import { CommentRateService } from './comment-rate.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CommentRateEntity } from '@database/entities';
import { CommentRateRepository } from '@modules/comment-rate/comment-rate.repository';

@Module({
  imports: [MikroOrmModule.forFeature([CommentRateEntity])],
  providers: [CommentRateService, CommentRateRepository],
  exports: [CommentRateService],
})
export class CommentRateModule {}
