import { Module } from '@nestjs/common';
import { ToiletService } from './toilet.service';
import { ToiletController } from './toilet.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ToiletEntity, TypeExtraEntity } from '@database/entities';
import { ToiletRepository } from '@modules/toilet/toilet.repository';
import { CommentRateModule } from '@modules/comment-rate';
import { UserModule } from '@modules/user';
import { AccessModule } from '@modules/access';
import { TypeExtraModule } from '@modules/type-extra';
import {
  GetToiletByPublicIdUseCase,
  GetToiletsByBoundingBoxUseCase,
  GetToiletsByProximityUseCase,
  GetToiletsUseCase,
  CreateToiletUseCase,
  UpdateToiletUseCase,
  DeleteToiletUseCase,
  UndeleteToiletUseCase,
  PublishToiletUseCase,
  DisableToiletUseCase,
  EnableToiletUseCase,
  UploadToiletImageUseCase,
} from '@modules/toilet/use-cases';
import { ViewToiletUseCase } from '@modules/toilet/use-cases/view-toilet.use-case';
import { InteractionModule } from '@modules/interaction';

/**
 * Módulo de Toilets
 *
 * @module ToiletModule
 * @description Organiza todos os componentes de gestão de toilets do sistema.
 * Gerir o ciclo de vida completo dos toilets, incluindo:
 * - Criação, edição e exclusão de toilets
 * - Listagem de toilets (por localização, bounding box, proximidade)
 * - Pesquisa full-text de toilets
 * - Sistema de status (SUGGESTED, ACTIVE, INACTIVE)
 * - Gestão de estado de toilets (publish, disable, enable, delete, undelete)
 * - Upload de imagens de toilets
 * - Gestão de extras/amenidades (Wi-Fi, acessibilidade, etc.)
 * - Registo de visualizações (analytics)
 *
 * @see ToiletController - Controlador com endpoints de toilets
 * @see ToiletService - Serviço para operações de toilets
 * @see ToiletRepository - Repositório para acesso aos dados
 */
@Module({
  imports: [
    MikroOrmModule.forFeature([ToiletEntity, TypeExtraEntity]),
    CommentRateModule,
    UserModule,
    AccessModule,
    TypeExtraModule,
    InteractionModule,
  ],
  controllers: [ToiletController],
  providers: [
    ToiletService,
    ToiletRepository,
    GetToiletByPublicIdUseCase,
    GetToiletsUseCase,
    GetToiletsByBoundingBoxUseCase,
    GetToiletsByProximityUseCase,
    CreateToiletUseCase,
    UpdateToiletUseCase,
    DeleteToiletUseCase,
    UndeleteToiletUseCase,
    PublishToiletUseCase,
    DisableToiletUseCase,
    EnableToiletUseCase,
    ViewToiletUseCase,
    UploadToiletImageUseCase,
  ],
  exports: [ToiletService],
})
export class ToiletModule {}
