import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PartnerEntity, SuggestionEntity } from '@database/entities';
import { PartnerService } from './partner.service';
import { PartnerController } from './partner.controller';
import { PartnerRepository } from './partner.repository';
import { ToiletModule } from '@modules/toilet';
import { UserModule } from '@modules/user';
import { UserCredentialModule } from '@modules/user-credential';
import { RoleModule } from '@modules/role';
import { EmailModule } from '@modules/email';
import { MinioModule } from '@modules/minio';
import {
  ApplyPartnerUseCase,
  GetPartnerSelfUseCase,
  UpdatePartnerSelfUseCase,
  GetPartnersManageUseCase,
  GetPartnerManageUseCase,
  ApprovePartnerManageUseCase,
  RejectPartnerManageUseCase,
  ActivatePartnerManageUseCase,
  DeactivatePartnerManageUseCase,
  DeletePartnerManageUseCase,
} from './use-cases';
import { EmailVerificationModule } from '@modules/email-verification';

/**
 * Gerencia a funcionalidade de parcerias, agrupando seus componentes.
 */
@Module({
  imports: [
    MikroOrmModule.forFeature([PartnerEntity, SuggestionEntity]),
    ToiletModule,
    UserModule,
    UserCredentialModule,
    RoleModule,
    EmailModule,
    EmailVerificationModule,
    MinioModule,
  ],
  controllers: [PartnerController],
  providers: [
    PartnerService,
    PartnerRepository,
    ApplyPartnerUseCase,
    GetPartnerSelfUseCase,
    UpdatePartnerSelfUseCase,
    GetPartnersManageUseCase,
    GetPartnerManageUseCase,
    ApprovePartnerManageUseCase,
    RejectPartnerManageUseCase,
    ActivatePartnerManageUseCase,
    DeactivatePartnerManageUseCase,
    DeletePartnerManageUseCase,
  ],
  exports: [PartnerService],
})
export class PartnerModule {}
