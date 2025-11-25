import { Module } from '@nestjs/common';
import { ToiletService } from './toilet.service';
import { ToiletController } from './toilet.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import {
  ToiletEntity,
  TypeExtraEntity,
  SuggestionEntity,
} from '@database/entities';
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
  DeleteExpiredToiletsUseCase,
} from '@modules/toilet/use-cases';
import { ViewToiletUseCase } from '@modules/toilet/use-cases/view-toilet.use-case';
import { InteractionModule } from '@modules/interaction';

/**
 * Gerencia a funcionalidade de casas de banho, agrupando seus componentes.
 */
@Module({
  imports: [
    MikroOrmModule.forFeature([
      ToiletEntity,
      TypeExtraEntity,
      SuggestionEntity,
    ]),
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
    DeleteExpiredToiletsUseCase,
  ],
  exports: [ToiletService],
})
export class ToiletModule {}
