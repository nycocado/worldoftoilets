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
} from '@modules/toilet/use-cases';

@Module({
  imports: [
    MikroOrmModule.forFeature([ToiletEntity, TypeExtraEntity]),
    CommentRateModule,
    UserModule,
    AccessModule,
    TypeExtraModule,
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
  ],
  exports: [ToiletService],
})
export class ToiletModule {}
