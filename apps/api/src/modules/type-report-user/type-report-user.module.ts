import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TypeReportUserEntity } from '@database/entities';
import { TypeReportUserService } from './type-report-user.service';
import { TypeReportUserRepository } from './type-report-user.repository';

/**
 * Gerencia a funcionalidade de tipos de denúncia de utilizadores, agrupando seus componentes.
 */
@Module({
  imports: [MikroOrmModule.forFeature([TypeReportUserEntity])],
  providers: [TypeReportUserService, TypeReportUserRepository],
  exports: [TypeReportUserService],
})
export class TypeReportUserModule {}
