import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CommentEntity } from '@database/entities/comment.entity';

@Module({
  imports: [MikroOrmModule.forFeature([CommentEntity])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
