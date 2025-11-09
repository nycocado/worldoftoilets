import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  InteractionDiscriminator,
  InteractionEntity,
  ToiletEntity,
  UserEntity,
} from '@database/entities';
import { EntityRepository, Transactional } from '@mikro-orm/mariadb';

@Injectable()
export class InteractionRepository {
  constructor(
    @InjectRepository(InteractionEntity)
    private readonly interactionRepository: EntityRepository<InteractionEntity>,
  ) {}

  @Transactional()
  async create(
    user: UserEntity,
    toilet: ToiletEntity,
    discriminator: InteractionDiscriminator,
  ): Promise<InteractionEntity> {
    const em = this.interactionRepository.getEntityManager();
    const interaction = new InteractionEntity();
    interaction.user = user;
    interaction.toilet = toilet;
    interaction.discriminator = discriminator;
    em.persist(interaction);
    await em.flush();
    return interaction;
  }

  @Transactional()
  async softDelete(
    interaction: InteractionEntity,
    user: UserEntity,
  ): Promise<InteractionEntity> {
    const em = this.interactionRepository.getEntityManager();
    interaction.deletedBy = user;
    interaction.deletedAt = new Date();
    await em.persistAndFlush(interaction);
    return interaction;
  }
}
