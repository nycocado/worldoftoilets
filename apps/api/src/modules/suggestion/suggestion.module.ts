import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SuggestionEntity, ToiletEntity } from '@database/entities';
import { SuggestionController } from './suggestion.controller';
import { SuggestionService } from './suggestion.service';
import { SuggestionRepository } from './suggestion.repository';
import {
  CreateSuggestionUseCase,
  GetSuggestionsUseCase,
  GetSuggestionByPublicIdUseCase,
  GetSuggestionsByUserUseCase,
  AcceptSuggestionUseCase,
  RejectSuggestionUseCase,
  SetPendingSuggestionUseCase,
  PublishSuggestionImageUseCase,
} from './use-cases';
import { InteractionModule } from '@modules/interaction';
import { UserModule } from '@modules/user';
import { AccessModule } from '@modules/access';
import { TypeExtraModule } from '@modules/type-extra';
import { ToiletModule } from '@modules/toilet';
import { MinioModule } from '@modules/minio';

/**
 * Gerencia a funcionalidade de sugestões, agrupando seus componentes.
 */
@Module({
  imports: [
    MikroOrmModule.forFeature([SuggestionEntity, ToiletEntity]),
    InteractionModule,
    UserModule,
    AccessModule,
    TypeExtraModule,
    ToiletModule,
    MinioModule,
  ],
  controllers: [SuggestionController],
  providers: [
    SuggestionService,
    SuggestionRepository,
    CreateSuggestionUseCase,
    GetSuggestionsUseCase,
    GetSuggestionByPublicIdUseCase,
    GetSuggestionsByUserUseCase,
    AcceptSuggestionUseCase,
    RejectSuggestionUseCase,
    SetPendingSuggestionUseCase,
    PublishSuggestionImageUseCase,
  ],
  exports: [SuggestionService],
})
export class SuggestionModule {}
