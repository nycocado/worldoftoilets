import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  PartnerEntity,
  PartnerStatus,
  ToiletEntity,
  UserEntity,
} from '@database/entities';
import {
  EntityRepository,
  FilterQuery,
  Transactional,
} from '@mikro-orm/mariadb';

/**
 * Gerencia o acesso e a persistência de dados para a entidade Partner.
 */
@Injectable()
export class PartnerRepository {
  constructor(
    @InjectRepository(PartnerEntity)
    private readonly repository: EntityRepository<PartnerEntity>,
  ) {}

  /**
   * Busca uma parceria pelo seu ID público.
   *
   * @param {string} publicId O ID público da parceria.
   * @returns {Promise<PartnerEntity | null>} A entidade da parceria ou `null` se não for encontrada.
   */
  async findByPublicId(publicId: string): Promise<PartnerEntity | null> {
    return this.repository.findOne(
      { publicId },
      {
        populate: [
          'toilet.access',
          'toilet.extras',
          'toilet.totalRatings',
          'toilet.avgClean',
          'toilet.avgStructure',
          'toilet.avgAccessibility',
          'toilet.paperAvailability',
          'user.partner',
          'user.commentsCount',
          'user.credential',
          'user.roles',
          'reviewedBy.partner',
          'reviewedBy.commentsCount',
          'reviewedBy.credential',
          'reviewedBy.roles',
        ],
      },
    );
  }

  /**
   * Busca uma parceria pelo ID público da casa de banho.
   *
   * @param {string} toiletPublicId O ID público da casa de banho.
   * @returns {Promise<PartnerEntity | null>} A entidade da parceria ou `null` se não for encontrada.
   */
  async findByToiletPublicId(
    toiletPublicId: string,
  ): Promise<PartnerEntity | null> {
    return this.repository.findOne(
      { toilet: { publicId: toiletPublicId } },
      {
        populate: [
          'toilet.access',
          'toilet.extras',
          'toilet.totalRatings',
          'toilet.avgClean',
          'toilet.avgStructure',
          'toilet.avgAccessibility',
          'toilet.paperAvailability',
          'user.partner',
          'user.commentsCount',
          'user.credential',
          'user.roles',
          'reviewedBy.partner',
          'reviewedBy.commentsCount',
          'reviewedBy.credential',
          'reviewedBy.roles',
        ],
      },
    );
  }

  /**
   * Busca uma parceria pelo utilizador associado.
   *
   * @param {string} userPublicId O ID público do utilizador.
   * @returns {Promise<PartnerEntity | null>} A entidade da parceria ou `null` se não for encontrada.
   */
  async findByUserPublicId(
    userPublicId: string,
  ): Promise<PartnerEntity | null> {
    return this.repository.findOne(
      { user: { publicId: userPublicId } },
      { populate: ['toilet', 'user', 'reviewedBy'] },
    );
  }

  /**
   * Busca parcerias com base em filtros.
   *
   * @param {PartnerStatus} [status] Filtra por status.
   * @param {string} [search] Pesquisa por nome, e-mail ou nome da casa de banho.
   * @param {Date} [timestamp] Filtra por data de criação.
   * @param {boolean} [pageable] Ativa a paginação.
   * @param {number} [page] O número da página.
   * @param {number} [size] O tamanho da página.
   * @returns {Promise<PartnerEntity[]>} Uma lista de parcerias.
   */
  async find(
    status?: PartnerStatus,
    search?: string,
    timestamp?: Date,
    pageable?: boolean,
    page?: number,
    size?: number,
  ): Promise<PartnerEntity[]> {
    const whereClause: FilterQuery<PartnerEntity> = {
      ...(status && { status }),
      ...(timestamp && { createdAt: { $gt: timestamp } }),
    };

    if (search) {
      whereClause.$or = [
        { contactEmail: { $like: `%${search}%` } },
        { toilet: { name: { $like: `%${search}%` } } },
        { user: { name: { $like: `%${search}%` } } },
      ];
    }

    return this.repository.find(whereClause, {
      populate: [
        'toilet.access',
        'toilet.extras',
        'toilet.totalRatings',
        'toilet.avgClean',
        'toilet.avgStructure',
        'toilet.avgAccessibility',
        'toilet.paperAvailability',
        'user.partner',
        'user.commentsCount',
        'user.credential',
        'user.roles',
        'reviewedBy.partner',
        'reviewedBy.commentsCount',
        'reviewedBy.credential',
        'reviewedBy.roles',
      ],
      orderBy: { createdAt: 'DESC' },
      ...(pageable && {
        limit: size,
        offset: ((page ?? 1) - 1) * (size ?? 10),
      }),
    });
  }

  /**
   * Cria uma nova parceria.
   *
   * @param {ToiletEntity} toilet A casa de banho.
   * @param {string} certificate URL do documento de certificação.
   * @param {string} contactEmail E-mail de contacto.
   * @returns {Promise<PartnerEntity>} A parceria criada.
   */
  async create(
    toilet: ToiletEntity,
    certificate: string | undefined,
    contactEmail: string,
  ): Promise<PartnerEntity> {
    const em = this.repository.getEntityManager();
    const partner = new PartnerEntity();
    partner.toilet = toilet;
    partner.certificate = certificate;
    partner.contactEmail = contactEmail;
    partner.status = PartnerStatus.PENDING;
    em.persist(partner);
    await em.flush();
    return partner;
  }

  /**
   * Atualiza o certificado de uma parceria.
   *
   * @param {PartnerEntity} partner A entidade da parceria.
   * @param {string} certificateUrl A nova URL do certificado.
   * @returns {Promise<void>}
   */
  @Transactional()
  async updateCertificate(
    partner: PartnerEntity,
    certificateUrl: string,
  ): Promise<void> {
    const em = this.repository.getEntityManager();
    partner.certificate = certificateUrl;
    await em.flush();
  }

  /**
   * Atualiza o e-mail de contacto de uma parceria.
   *
   * @param {PartnerEntity} partner A entidade da parceria.
   * @param {string} contactEmail O novo e-mail de contacto.
   * @returns {Promise<PartnerEntity>} A parceria atualizada.
   */
  @Transactional()
  async updateContactEmail(
    partner: PartnerEntity,
    contactEmail: string,
  ): Promise<PartnerEntity> {
    const em = this.repository.getEntityManager();
    partner.contactEmail = contactEmail;
    await em.flush();
    return partner;
  }

  /**
   * Aprova uma parceria e associa o utilizador criado.
   *
   * @param {PartnerEntity} partner A entidade da parceria.
   * @param {UserEntity} user O utilizador criado para a parceria.
   * @param {UserEntity} admin O administrador que aprovou.
   * @returns {Promise<PartnerEntity>} A parceria aprovada.
   */
  @Transactional()
  async approve(
    partner: PartnerEntity,
    user: UserEntity,
    admin: UserEntity,
  ): Promise<PartnerEntity> {
    const em = this.repository.getEntityManager();
    partner.user = user;
    partner.status = PartnerStatus.ACTIVE;
    partner.reviewedBy = admin;
    partner.reviewedAt = new Date();
    await em.flush();
    return partner;
  }

  /**
   * Rejeita uma parceria.
   *
   * @param {PartnerEntity} partner A entidade da parceria.
   * @param {UserEntity} admin O administrador que rejeitou.
   * @returns {Promise<PartnerEntity>} A parceria rejeitada.
   */
  @Transactional()
  async reject(
    partner: PartnerEntity,
    admin: UserEntity,
  ): Promise<PartnerEntity> {
    const em = this.repository.getEntityManager();
    partner.status = PartnerStatus.REJECTED;
    partner.reviewedBy = admin;
    partner.reviewedAt = new Date();
    await em.flush();
    return partner;
  }

  /**
   * Ativa uma parceria.
   *
   * @param {PartnerEntity} partner A entidade da parceria.
   * @returns {Promise<PartnerEntity>} A parceria ativada.
   */
  @Transactional()
  async activate(partner: PartnerEntity): Promise<PartnerEntity> {
    const em = this.repository.getEntityManager();
    partner.status = PartnerStatus.ACTIVE;
    await em.flush();
    return partner;
  }

  /**
   * Desativa uma parceria.
   *
   * @param {PartnerEntity} partner A entidade da parceria.
   * @returns {Promise<PartnerEntity>} A parceria desativada.
   */
  @Transactional()
  async deactivate(partner: PartnerEntity): Promise<PartnerEntity> {
    const em = this.repository.getEntityManager();
    partner.status = PartnerStatus.INACTIVE;
    await em.flush();
    return partner;
  }

  /**
   * Remove uma parceria.
   *
   * @param {PartnerEntity} partner A entidade da parceria a ser removida.
   * @returns {Promise<void>}
   */
  @Transactional()
  async remove(partner: PartnerEntity): Promise<void> {
    const em = this.repository.getEntityManager();
    em.remove(partner);
    await em.flush();
  }
}
