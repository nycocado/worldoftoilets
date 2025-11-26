import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ReportUserEntity } from '@database/entities';
import { ReportUserService } from './report-user.service';
import { ReportUserController } from './report-user.controller';
import { ReportUserRepository } from './report-user.repository';
import {
  CreateReportUserUseCase,
  GetReportsUserUseCase,
  GetReportUserDetailsUseCase,
  AcceptReportUserUseCase,
  RejectReportUserUseCase,
  ReturnReportUserToPendingUseCase,
} from './use-cases';
import { UserModule } from '@modules/user';
import { TypeReportUserModule } from '@modules/type-report-user';

/**
 * Gerencia a funcionalidade de denúncias de utilizadores, agrupando seus componentes.
 */
@Module({
  imports: [
    MikroOrmModule.forFeature([ReportUserEntity]),
    UserModule,
    TypeReportUserModule,
  ],
  controllers: [ReportUserController],
  providers: [
    ReportUserService,
    ReportUserRepository,
    CreateReportUserUseCase,
    GetReportsUserUseCase,
    GetReportUserDetailsUseCase,
    AcceptReportUserUseCase,
    RejectReportUserUseCase,
    ReturnReportUserToPendingUseCase,
  ],
  exports: [ReportUserService],
})
export class ReportUserModule {}
