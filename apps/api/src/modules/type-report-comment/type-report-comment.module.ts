import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TypeReportCommentEntity } from '@database/entities';
import { TypeReportCommentService } from './type-report-comment.service';
import { TypeReportCommentRepository } from './type-report-comment.repository';

/**
 * Gerencia a funcionalidade de tipos de denúncia de comentários, agrupando seus componentes.
 */
@Module({
  imports: [MikroOrmModule.forFeature([TypeReportCommentEntity])],
  providers: [TypeReportCommentService, TypeReportCommentRepository],
  exports: [TypeReportCommentService],
})
export class TypeReportCommentModule {}
