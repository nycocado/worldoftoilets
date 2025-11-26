import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ReportCommentEntity } from '@database/entities';
import { ReportCommentService } from './report-comment.service';
import { ReportCommentController } from './report-comment.controller';
import { ReportCommentRepository } from './report-comment.repository';
import {
  CreateReportCommentUseCase,
  GetReportsCommentUseCase,
  GetReportCommentDetailsUseCase,
  AcceptReportCommentUseCase,
  RejectReportCommentUseCase,
  ReturnReportCommentToPendingUseCase,
} from './use-cases';
import { UserModule } from '@modules/user';
import { CommentModule } from '@modules/comment';
import { ReactModule } from '@modules/react';
import { TypeReportCommentModule } from '@modules/type-report-comment';

/**
 * Gerencia a funcionalidade de denúncias de comentários, agrupando seus componentes.
 */
@Module({
  imports: [
    MikroOrmModule.forFeature([ReportCommentEntity]),
    UserModule,
    CommentModule,
    ReactModule,
    TypeReportCommentModule,
  ],
  controllers: [ReportCommentController],
  providers: [
    ReportCommentService,
    ReportCommentRepository,
    CreateReportCommentUseCase,
    GetReportsCommentUseCase,
    GetReportCommentDetailsUseCase,
    AcceptReportCommentUseCase,
    RejectReportCommentUseCase,
    ReturnReportCommentToPendingUseCase,
  ],
  exports: [ReportCommentService],
})
export class ReportCommentModule {}
