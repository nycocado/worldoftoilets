import { Module } from '@nestjs/common';
import { InteractionService } from './interaction.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { InteractionEntity } from '@database/entities';
import { InteractionRepository } from '@modules/interaction/interaction.repository';

@Module({
  imports: [MikroOrmModule.forFeature([InteractionEntity])],
  providers: [InteractionService, InteractionRepository],
  exports: [InteractionService],
})
export class InteractionModule {}
