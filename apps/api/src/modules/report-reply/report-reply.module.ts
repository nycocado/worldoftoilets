import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ReportReplyEntity } from '@database/entities';
import { ReportReplyService } from './report-reply.service';
import { ReportReplyController } from './report-reply.controller';
import { ReportReplyRepository } from './report-reply.repository';
import {
  CreateReportReplyUseCase,
  GetReportsReplyUseCase,
  GetReportReplyDetailsUseCase,
  AcceptReportReplyUseCase,
  RejectReportReplyUseCase,
  ReturnReportReplyToPendingUseCase,
} from './use-cases';
import { UserModule } from '@modules/user';
import { ReplyModule } from '@modules/reply';
import { TypeReportReplyModule } from '@modules/type-report-reply';

/**
 * Gerencia a funcionalidade de denúncias de respostas, agrupando seus componentes.
 */
@Module({
  imports: [
    MikroOrmModule.forFeature([ReportReplyEntity]),
    UserModule,
    ReplyModule,
    TypeReportReplyModule,
  ],
  controllers: [ReportReplyController],
  providers: [
    ReportReplyService,
    ReportReplyRepository,
    CreateReportReplyUseCase,
    GetReportsReplyUseCase,
    GetReportReplyDetailsUseCase,
    AcceptReportReplyUseCase,
    RejectReportReplyUseCase,
    ReturnReportReplyToPendingUseCase,
  ],
  exports: [ReportReplyService],
})
export class ReportReplyModule {}
