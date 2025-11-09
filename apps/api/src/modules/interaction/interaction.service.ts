import { Injectable } from '@nestjs/common';
import { InteractionRepository } from '@modules/interaction/interaction.repository';
import {
  InteractionDiscriminator,
  InteractionEntity,
  ToiletEntity,
  UserEntity,
} from '@database/entities';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InteractionService {
  constructor(
    private readonly configService: ConfigService,
    private readonly interactionRepository: InteractionRepository,
  ) {}

  async createInteraction(
    user: UserEntity,
    toilet: ToiletEntity,
    discriminator: InteractionDiscriminator,
  ): Promise<InteractionEntity> {
    return this.interactionRepository.create(user, toilet, discriminator);
  }

  async softDeleteInteraction(
    interaction: InteractionEntity,
    user: UserEntity,
  ): Promise<InteractionEntity> {
    return this.interactionRepository.softDelete(interaction, user);
  }
}
