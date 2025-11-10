import { Module } from '@nestjs/common';
import { ToiletService } from './toilet.service';
import { ToiletController } from './toilet.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ToiletEntity } from '@database/entities';
import { ToiletRepository } from '@modules/toilet/toilet.repository';
import { EnrichToiletsWithCommentRateUseCase } from '@modules/toilet/use-cases/enrich-toilets-with-comment-rate.use-case';
import { CommentRateModule } from '@modules/comment-rate';
import { UserModule } from '@modules/user';

@Module({
  imports: [
    MikroOrmModule.forFeature([ToiletEntity]),
    CommentRateModule,
    UserModule,
  ],
  controllers: [ToiletController],
  providers: [
    ToiletService,
    ToiletRepository,
    EnrichToiletsWithCommentRateUseCase,
  ],
  exports: [ToiletService],
})
export class ToiletModule {}
