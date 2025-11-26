import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TypeReportReplyEntity } from '@database/entities';
import { TypeReportReplyService } from './type-report-reply.service';
import { TypeReportReplyRepository } from './type-report-reply.repository';

/**
 * Gerencia a funcionalidade de tipos de denúncia de respostas, agrupando seus componentes.
 */
@Module({
  imports: [MikroOrmModule.forFeature([TypeReportReplyEntity])],
  providers: [TypeReportReplyService, TypeReportReplyRepository],
  exports: [TypeReportReplyService],
})
export class TypeReportReplyModule {}
