import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { Transactional } from '@mikro-orm/mariadb';
import { ToiletRepository } from '@modules/toilet/toilet.repository';
import { MinioService } from '@modules/minio';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/mariadb';
import { SuggestionEntity } from '@database/entities';
import { textTimeToMilliseconds } from '@common/utils/jwt-time.util';

/**
 * Contém a lógica de negócio para deletar casas de banho expiradas e limpar seus arquivos.
 */
@Injectable()
export class DeleteExpiredToiletsUseCase {
  constructor(
    private readonly repository: ToiletRepository,
    @InjectRepository(SuggestionEntity)
    private readonly suggestionRepository: EntityRepository<SuggestionEntity>,
    private readonly minioService: MinioService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Remove permanentemente as casas de banho e seus arquivos associados que excederam o período de retenção do soft delete.
   * Também limpa imagens de suggestions associadas que serão deletadas em cascade.
   * Este método é executado como um Cron Job diário.
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteExpired(): Promise<void> {
    const toiletRetention = this.configService.getOrThrow<string>(
      'TOILET_SOFT_DELETE_RETENTION',
    );
    const retentionMs = textTimeToMilliseconds(toiletRetention);
    const retention = new Date(Date.now() - retentionMs);

    await this.execute(retention);
  }

  /**
   * Remove permanentemente casas de banho soft-deleted expiradas e seus arquivos do MinIO.
   * Também limpa imagens de suggestions associadas que serão deletadas em cascade.
   *
   * @param {Date} retention A data limite de retenção.
   * @returns {Promise<void>}
   */
  @Transactional()
  async execute(retention: Date): Promise<void> {
    // Busca todos os toilets expirados
    const toilets = await this.repository.findExpired(retention);

    for (const toilet of toilets) {
      // Remove a imagem do toilet se existir
      if (toilet.photoUrl) {
        await this.minioService.deleteFile(toilet.photoUrl).catch(() => {});
      }

      // Busca suggestions associadas a este toilet que serão deletadas em cascade
      const suggestions = await this.suggestionRepository.find({
        interaction: { toilet: { id: toilet.id } },
      });

      // Remove as imagens das suggestions
      for (const suggestion of suggestions) {
        if (suggestion.photoUrl) {
          await this.minioService
            .deleteFile(suggestion.photoUrl)
            .catch(() => {});
        }
      }
    }

    // Deleta os toilets (cascade vai deletar interactions e suggestions)
    await this.repository.deleteExpired(retention);
  }
}
