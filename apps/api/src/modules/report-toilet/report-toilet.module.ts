import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ReportToiletEntity } from '@database/entities';
import { ReportToiletService } from './report-toilet.service';
import { ReportToiletController } from './report-toilet.controller';
import { ReportToiletRepository } from './report-toilet.repository';
import {
  CreateReportToiletUseCase,
  GetReportsToiletUseCase,
  GetReportToiletDetailsUseCase,
  AcceptReportToiletUseCase,
  RejectReportToiletUseCase,
  ReturnReportToiletToPendingUseCase,
} from './use-cases';
import { UserModule } from '@modules/user';
import { ToiletModule } from '@modules/toilet';
import { InteractionModule } from '@modules/interaction';
import { TypeReportToiletModule } from '@modules/type-report-toilet';

/**
 * Gerencia a funcionalidade de denúncias de casas de banho, agrupando seus componentes.
 */
@Module({
  imports: [
    MikroOrmModule.forFeature([ReportToiletEntity]),
    UserModule,
    ToiletModule,
    InteractionModule,
    TypeReportToiletModule,
  ],
  controllers: [ReportToiletController],
  providers: [
    ReportToiletService,
    ReportToiletRepository,
    CreateReportToiletUseCase,
    GetReportsToiletUseCase,
    GetReportToiletDetailsUseCase,
    AcceptReportToiletUseCase,
    RejectReportToiletUseCase,
    ReturnReportToiletToPendingUseCase,
  ],
  exports: [ReportToiletService],
})
export class ReportToiletModule {}
