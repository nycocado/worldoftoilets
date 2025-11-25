import { Injectable, NotFoundException } from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { PartnerRepository } from '@modules/partner/partner.repository';
import { MinioService } from '@modules/minio';
import { PARTNER_EXCEPTIONS } from '@modules/partner/constants';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/mariadb';
import { SuggestionEntity } from '@database/entities';

/**
 * Contém a lógica de negócio para deletar uma parceria (admin).
 */
@Injectable()
export class DeletePartnerManageUseCase {
  constructor(
    private readonly repository: PartnerRepository,
    @InjectRepository(SuggestionEntity)
    private readonly suggestionRepository: EntityRepository<SuggestionEntity>,
    private readonly minioService: MinioService,
  ) {}

  /**
   * Remove uma parceria permanentemente e todos os arquivos associados do MinIO.
   * Também limpa os arquivos do toilet e suggestions que serão deletados em cascade.
   *
   * @param {string} publicId O ID público da parceria.
   * @returns {Promise<void>}
   * @throws {NotFoundException} Se a parceria não for encontrada.
   */
  @Transactional()
  async execute(publicId: string): Promise<void> {
    const partner = await this.repository.findByPublicId(publicId);

    if (!partner) {
      throw new NotFoundException(PARTNER_EXCEPTIONS.PARTNER_NOT_FOUND);
    }

    // Remove o certificado do Partner
    if (partner.certificate) {
      const fileName = this.minioService.extractFileNameFromUrl(
        partner.certificate,
        'partner-certificates',
      );
      if (fileName) {
        await this.minioService.deleteFile(fileName).catch(() => {});
      }
    }

    // Remove a imagem do Toilet que será deletado em cascade
    if (partner.toilet?.photoUrl) {
      const fileName = this.minioService.extractFileNameFromUrl(
        partner.toilet.photoUrl,
        'toilets',
      );
      if (fileName) {
        await this.minioService.deleteFile(fileName).catch(() => {});
      }
    }

    // Remove as imagens das Suggestions que serão deletadas em cascade
    if (partner.toilet) {
      const suggestions = await this.suggestionRepository.find({
        interaction: { toilet: { id: partner.toilet.id } },
      });

      for (const suggestion of suggestions) {
        if (suggestion.photoUrl) {
          const fileName = this.minioService.extractFileNameFromUrl(
            suggestion.photoUrl,
            'suggestions',
          );
          if (fileName) {
            await this.minioService.deleteFile(fileName).catch(() => {});
          }
        }
      }
    }

    await this.repository.remove(partner);
  }
}
