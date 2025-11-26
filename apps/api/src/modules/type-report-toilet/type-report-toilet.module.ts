import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TypeReportToiletEntity } from '@database/entities';
import { TypeReportToiletService } from './type-report-toilet.service';
import { TypeReportToiletRepository } from './type-report-toilet.repository';

/**
 * Gerencia a funcionalidade de tipos de denúncia de casas de banho, agrupando seus componentes.
 */
@Module({
  imports: [MikroOrmModule.forFeature([TypeReportToiletEntity])],
  providers: [TypeReportToiletService, TypeReportToiletRepository],
  exports: [TypeReportToiletService],
})
export class TypeReportToiletModule {}
