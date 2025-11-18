import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  AccessApiName,
  AccessEntity,
  ToiletEntity,
  ToiletStatus,
  TypeExtraApiName,
  TypeExtraEntity,
  UserEntity,
} from '@database/entities';
import { EntityRepository, Transactional } from '@mikro-orm/mariadb';

/**
 * Repositório de Toilets
 *
 * @class ToiletRepository
 * @description Repositório de acesso a dados para entidade ToiletEntity.
 * Oferece operações CRUD e queries complexas para toilets, incluindo:
 * - Busca por publicId, localização, bounding box e proximidade
 * - Pesquisa full-text por nome e endereço
 * - Operações transacionais de criação, atualização e remoção
 * - Gestão de soft delete e estados de toilets
 * - Queries geoespaciais com cálculo de distância
 * - Filtros por acesso, status e extras
 *
 * @implements
 *   - Padrão Repository para isolar lógica de acesso a dados
 *   - Transações com decorator @Transactional do MikroORM
 *   - Queries geoespaciais com fórmula Haversine
 *   - Full-text search com MySQL MATCH AGAINST
 *   - Soft delete com período de retenção
 *
 * @see ToiletEntity - Entidade de domínio representando toilets
 */
@Injectable()
export class ToiletRepository {
  /**
   * Construtor do ToiletRepository
   *
   * @param {EntityRepository<ToiletEntity>} repository - Repositório MikroORM injetado
   */
  constructor(
    @InjectRepository(ToiletEntity)
    private readonly repository: EntityRepository<ToiletEntity>,
  ) {}

  /**
   * Buscar toilet por publicId
   *
   * @async
   * @param {string} publicId - Identificador público único do toilet (UUID)
   * @returns {Promise<ToiletEntity | null>} Toilet encontrado ou null
   *
   * @description
   * Busca um toilet pelo seu publicId (UUID).
   * Carrega automaticamente access, extras, partner e estatísticas de avaliação.
   */
  async findByPublicId(publicId: string): Promise<ToiletEntity | null> {
    return this.repository.findOne(
      { publicId },
      {
        populate: [
          'access',
          'extras',
          'partner',
          'totalRatings',
          'avgClean',
          'avgStructure',
          'avgAccessibility',
          'paperAvailability',
        ],
      },
    );
  }

  /**
   * Buscar toilets com filtros
   *
   * @async
   * @param {string} [city] - Filtrar por cidade
   * @param {string} [country] - Filtrar por país
   * @param {string} [countryCode] - Filtrar por código ISO do país
   * @param {AccessApiName} [access] - Filtrar por tipo de acesso
   * @param {ToiletStatus} [status] - Filtrar por status
   * @param {Date} [timestamp] - Data limite (toilets atualizados antes desta data)
   * @param {boolean} [pageable] - Se deve aplicar paginação
   * @param {number} [page] - Número da página (zero-indexed)
   * @param {number} [size] - Tamanho da página
   * @param {TypeExtraApiName[]} [extras] - Filtrar por extras disponíveis
   * @returns {Promise<ToiletEntity[]>} Lista de toilets
   *
   * @description
   * Busca toilets aplicando múltiplos filtros opcionais.
   * Suporta paginação e filtro por extras (amenidades).
   * Carrega automaticamente access, extras e estatísticas de avaliação.
   */
  async find(
    city?: string,
    country?: string,
    countryCode?: string,
    access?: AccessApiName,
    status?: ToiletStatus,
    timestamp?: Date,
    pageable?: boolean,
    page?: number,
    size?: number,
    extras?: TypeExtraApiName[],
  ): Promise<ToiletEntity[]> {
    return this.repository.find(
      {
        ...(city && { city }),
        ...(country && { country }),
        ...(countryCode && { countryCode }),
        ...(access && { access: { apiName: access } }),
        ...(status && { status }),
        ...(timestamp && { updatedAt: { $lte: timestamp } }),
        ...(extras &&
          extras.length > 0 && {
            extras: {
              $some: {
                apiName: { $in: Array.isArray(extras) ? extras : [extras] },
              },
            },
          }),
      },
      {
        populate: [
          'access',
          'extras',
          'totalRatings',
          'avgClean',
          'avgStructure',
          'avgAccessibility',
          'paperAvailability',
        ],
        ...(pageable &&
          page !== undefined &&
          size !== undefined && {
            limit: size,
            offset: page * size,
          }),
      },
    );
  }

  /**
   * Buscar toilets por bounding box (área geográfica retangular)
   *
   * @async
   * @param {number} minLat - Latitude mínima (canto sudoeste)
   * @param {number} minLng - Longitude mínima (canto sudoeste)
   * @param {number} maxLat - Latitude máxima (canto nordeste)
   * @param {number} maxLng - Longitude máxima (canto nordeste)
   * @param {AccessApiName} [access] - Filtrar por tipo de acesso
   * @param {ToiletStatus} [status] - Filtrar por status
   * @param {Date} [timestamp] - Data limite (toilets atualizados antes desta data)
   * @param {TypeExtraApiName[]} [extras] - Filtrar por extras disponíveis
   * @returns {Promise<ToiletEntity[]>} Lista de toilets dentro da área
   *
   * @description
   * Busca toilets dentro de uma área retangular definida por coordenadas geográficas.
   * Útil para exibir toilets em mapas (como Google Maps, Leaflet, etc.).
   * Filtra toilets onde latitude está entre minLat e maxLat, e longitude entre minLng e maxLng.
   */
  async findByBoundingBox(
    minLat: number,
    minLng: number,
    maxLat: number,
    maxLng: number,
    access?: AccessApiName,
    status?: ToiletStatus,
    timestamp?: Date,
    extras?: TypeExtraApiName[],
  ): Promise<ToiletEntity[]> {
    return this.repository.find(
      {
        latitude: { $gte: minLat, $lte: maxLat },
        longitude: { $gte: minLng, $lte: maxLng },
        ...(access && { access: { apiName: access } }),
        ...(status && { status }),
        ...(timestamp && { updatedAt: { $lte: timestamp } }),
        ...(extras &&
          extras.length > 0 && {
            extras: {
              $some: {
                apiName: {
                  $in: Array.isArray(extras) ? extras : [extras],
                },
              },
            },
          }),
      },
      {
        populate: [
          'access',
          'extras',
          'totalRatings',
          'avgClean',
          'avgStructure',
          'avgAccessibility',
          'paperAvailability',
        ],
      },
    );
  }

  /**
   * Buscar toilets por proximidade (ordenados por distância)
   *
   * @async
   * @param {number} lat - Latitude de referência
   * @param {number} lng - Longitude de referência
   * @param {AccessApiName} [access] - Filtrar por tipo de acesso
   * @param {ToiletStatus} [status] - Filtrar por status
   * @param {Date} [timestamp] - Data limite (toilets atualizados antes desta data)
   * @param {boolean} [pageable] - Se deve aplicar paginação
   * @param {number} [page] - Número da página (zero-indexed)
   * @param {number} [size] - Tamanho da página
   * @param {TypeExtraApiName[]} [extras] - Filtrar por extras disponíveis
   * @returns {Promise<ToiletEntity[]>} Lista de toilets ordenados por distância
   *
   * @description
   * Busca toilets ordenados por distância de um ponto de referência.
   * Usa fórmula Haversine para calcular distância em quilómetros.
   * Resultados ordenados por distância crescente (mais próximos primeiro).
   * Útil para funcionalidade "toilets próximos de mim".
   */
  async findByProximity(
    lat: number,
    lng: number,
    access?: AccessApiName,
    status?: ToiletStatus,
    timestamp?: Date,
    pageable?: boolean,
    page?: number,
    size?: number,
    extras?: TypeExtraApiName[],
  ): Promise<ToiletEntity[]> {
    const em = this.repository.getEntityManager();
    const qb = this.repository.createQueryBuilder('t');

    // Apply joins first
    qb.leftJoinAndSelect('t.access', 'access').leftJoinAndSelect(
      't.extras',
      'extras',
    );

    // Then apply filters using the aliases
    if (access) qb.andWhere({ 'access.apiName': access });
    if (status) qb.andWhere({ status });
    if (timestamp) qb.andWhere({ updatedAt: { $lte: timestamp } });
    if (extras && extras.length > 0) {
      qb.andWhere({ 'extras.apiName': { $in: extras } });
    }

    if (extras && extras.length > 0) {
      qb.distinct();
    }

    const knex = qb.getKnexQuery();
    knex.select(
      em
        .getConnection()
        .getKnex()
        .raw(
          `(6371 * acos(cos(radians(?)) * cos(radians(t.latitude)) * cos(radians(t.longitude) - radians(?)) + sin(radians(?)) * sin(radians(t.latitude)))) as distance`,
          [lat, lng, lat],
        ),
    );
    knex.orderBy('distance', 'asc');

    if (pageable && page !== undefined && size !== undefined) {
      knex.limit(size).offset(page * size);
    }

    const results = await qb.getResultList();

    await this.repository.populate(results, [
      'totalRatings',
      'avgClean',
      'avgStructure',
      'avgAccessibility',
      'paperAvailability',
    ]);

    return results;
  }

  /**
   * Pesquisar toilets por full-text search
   *
   * @async
   * @param {string} query - Termo de pesquisa
   * @param {boolean} [pageable] - Se deve aplicar paginação
   * @param {number} [page] - Número da página (zero-indexed)
   * @param {number} [size] - Tamanho da página
   * @param {ToiletStatus} [state] - Filtrar por status
   * @returns {Promise<ToiletEntity[]>} Lista de toilets ordenados por relevância
   *
   * @description
   * Realiza pesquisa full-text usando MySQL MATCH AGAINST.
   * Pesquisa nos campos name e address do toilet.
   * Resultados ordenados por relevância descendente (mais relevantes primeiro).
   * Requer índice FULLTEXT em (name, address) no banco de dados.
   */
  async findByFullTextSearch(
    query: string,
    pageable?: boolean,
    page?: number,
    size?: number,
    state?: ToiletStatus,
  ): Promise<ToiletEntity[]> {
    const em = this.repository.getEntityManager();
    const qb = this.repository.createQueryBuilder('t');

    if (state) {
      qb.where({ status: state });
    }

    qb.where(`MATCH(t.name, t.address) AGAINST(? IN NATURAL LANGUAGE MODE)`, [
      query,
    ]);

    if (pageable && page !== undefined && size !== undefined) {
      qb.limit(size).offset(page * size);
    }

    const knex = qb.getKnexQuery();
    knex.select(
      em
        .getConnection()
        .getKnex()
        .raw(
          `MATCH(t.name, t.address) AGAINST(? IN NATURAL LANGUAGE MODE) as relevance`,
          [query],
        ),
    );
    knex.orderBy('relevance', 'desc');

    return qb.getResultList();
  }

  /**
   * Criar novo toilet (transacional)
   *
   * @async
   * @transactional
   * @param {AccessEntity} access - Entidade de tipo de acesso
   * @param {string} name - Nome do toilet
   * @param {number} latitude - Latitude da localização
   * @param {number} longitude - Longitude da localização
   * @param {string} address - Endereço completo
   * @param {string} city - Cidade
   * @param {string | undefined} state - Estado/província (opcional)
   * @param {string} country - País
   * @param {string} countryCode - Código ISO do país
   * @param {ToiletStatus} status - Status inicial do toilet
   * @param {string | undefined} placeId - Google Places ID (opcional)
   * @param {TypeExtraEntity[]} [extras] - Lista de extras disponíveis
   * @returns {Promise<ToiletEntity>} Toilet criado
   *
   * @description
   * Cria novo toilet e persiste no banco de dados.
   * Operação transacional garante atomicidade.
   */
  @Transactional()
  async create(
    access: AccessEntity,
    name: string,
    latitude: number,
    longitude: number,
    address: string,
    city: string,
    state: string | undefined,
    country: string,
    countryCode: string,
    status: ToiletStatus,
    placeId: string | undefined,
    extras?: TypeExtraEntity[],
  ): Promise<ToiletEntity> {
    const em = this.repository.getEntityManager();
    const toilet = new ToiletEntity();
    toilet.access = access;
    toilet.name = name;
    toilet.latitude = latitude;
    toilet.longitude = longitude;
    toilet.address = address;
    toilet.city = city;
    toilet.state = state;
    toilet.country = country;
    toilet.countryCode = countryCode;
    toilet.status = status;
    toilet.placeId = placeId;
    toilet.extras.set(extras || []);
    await em.persistAndFlush(toilet);
    return toilet;
  }

  /**
   * Atualizar toilet (transacional)
   *
   * @async
   * @transactional
   * @param {ToiletEntity} toilet - Entidade do toilet a atualizar
   * @param {AccessEntity} [access] - Novo tipo de acesso
   * @param {string} [name] - Novo nome
   * @param {number} [latitude] - Nova latitude
   * @param {number} [longitude] - Nova longitude
   * @param {string} [address] - Novo endereço
   * @param {string} [city] - Nova cidade
   * @param {string} [state] - Novo estado/província
   * @param {string} [country] - Novo país
   * @param {string} [countryCode] - Novo código do país
   * @param {string} [placeId] - Novo Google Places ID
   * @param {TypeExtraEntity[]} [extras] - Nova lista de extras
   * @returns {Promise<ToiletEntity>} Toilet atualizado
   *
   * @description
   * Atualiza campos opcionais do toilet. Apenas campos fornecidos são atualizados.
   * Operação transacional garante atomicidade.
   */
  @Transactional()
  async update(
    toilet: ToiletEntity,
    access?: AccessEntity,
    name?: string,
    latitude?: number,
    longitude?: number,
    address?: string,
    city?: string,
    state?: string,
    country?: string,
    countryCode?: string,
    placeId?: string,
    extras?: TypeExtraEntity[],
  ): Promise<ToiletEntity> {
    const em = this.repository.getEntityManager();
    toilet.access = access || toilet.access;
    toilet.name = name || toilet.name;
    toilet.latitude = latitude || toilet.latitude;
    toilet.longitude = longitude || toilet.longitude;
    toilet.address = address || toilet.address;
    toilet.city = city || toilet.city;
    toilet.state = state !== undefined ? state : toilet.state;
    toilet.country = country || toilet.country;
    toilet.countryCode = countryCode || toilet.countryCode;
    toilet.placeId = placeId !== undefined ? placeId : toilet.placeId;
    if (extras) {
      toilet.extras.set(extras);
    }
    await em.flush();
    return toilet;
  }

  /**
   * Deletar toilets expirados (transacional)
   *
   * @async
   * @transactional
   * @param {Date} retention - Data de retenção limite
   * @returns {Promise<void>}
   *
   * @description
   * Remove permanentemente toilets com soft delete expirado.
   * Busca toilets deletados antes da data de retenção e remove da base de dados.
   * Usado por cron jobs para limpeza periódica.
   */
  @Transactional()
  async deleteExpired(retention: Date): Promise<void> {
    const em = this.repository.getEntityManager();
    const toilets = await this.repository.find({
      deletedAt: { $lte: retention },
    });
    await em.removeAndFlush(toilets);
  }

  /**
   * Marcar toilet como deletado (soft delete transacional)
   *
   * @async
   * @transactional
   * @param {ToiletEntity} toilet - Entidade do toilet a deletar
   * @param {any} deletedBy - Utilizador que deletou
   * @returns {Promise<void>}
   *
   * @description
   * Marca toilet como deletado (soft delete) sem remover do banco.
   * Muda status para INACTIVE e regista quem deletou e quando.
   * Pode ser recuperado posteriormente com undelete.
   */
  @Transactional()
  async softDelete(toilet: ToiletEntity, deletedBy: any): Promise<void> {
    const em = this.repository.getEntityManager();
    toilet.status = ToiletStatus.INACTIVE;
    toilet.deletedBy = deletedBy;
    toilet.deletedAt = new Date();
    await em.flush();
  }

  /**
   * Alterar status do toilet (transacional)
   *
   * @async
   * @transactional
   * @param {ToiletEntity} toilet - Entidade do toilet
   * @param {ToiletStatus} status - Novo status
   * @returns {Promise<ToiletEntity>} Toilet com status atualizado
   *
   * @description
   * Altera o status do toilet (SUGGESTED, ACTIVE, INACTIVE).
   * Operação transacional garante atomicidade.
   */
  @Transactional()
  async changeStatus(
    toilet: ToiletEntity,
    status: ToiletStatus,
  ): Promise<ToiletEntity> {
    const em = this.repository.getEntityManager();
    toilet.status = status;
    await em.flush();
    return toilet;
  }

  /**
   * Publicar toilet sugerido (transacional)
   *
   * @async
   * @transactional
   * @param {ToiletEntity} toilet - Entidade do toilet a publicar
   * @param {UserEntity} user - Utilizador que aprovou
   * @returns {Promise<ToiletEntity>} Toilet publicado
   *
   * @description
   * Aprova toilet sugerido, mudando status para ACTIVE.
   * Regista quem aprovou e quando.
   * Operação transacional garante atomicidade.
   */
  @Transactional()
  async publish(toilet: ToiletEntity, user: UserEntity): Promise<ToiletEntity> {
    const em = this.repository.getEntityManager();
    toilet.status = ToiletStatus.ACTIVE;
    toilet.reviewedBy = user;
    toilet.reviewedAt = new Date();
    await em.flush();
    return toilet;
  }

  /**
   * Recuperar toilet deletado (transacional)
   *
   * @async
   * @transactional
   * @param {ToiletEntity} toilet - Entidade do toilet a recuperar
   * @returns {Promise<ToiletEntity>} Toilet recuperado
   *
   * @description
   * Reverte soft delete do toilet, removendo marcadores de deleção.
   * Restaura toilet para estado ativo.
   * Operação transacional garante atomicidade.
   */
  @Transactional()
  async undelete(toilet: ToiletEntity): Promise<ToiletEntity> {
    const em = this.repository.getEntityManager();
    toilet.deletedBy = undefined;
    toilet.deletedAt = undefined;
    await em.flush();
    return toilet;
  }

  /**
   * Atualizar URL da foto do toilet (transacional)
   *
   * @async
   * @transactional
   * @param {ToiletEntity} toilet - Entidade do toilet
   * @param {string} photoUrl - URL pública da foto
   * @returns {Promise<ToiletEntity>} Toilet com foto atualizada
   *
   * @description
   * Atualiza o campo photoUrl do toilet.
   * Usado após upload de imagem para MinIO/S3.
   * Operação transacional garante atomicidade.
   */
  @Transactional()
  async updatePhotoUrl(
    toilet: ToiletEntity,
    photoUrl: string,
  ): Promise<ToiletEntity> {
    const em = this.repository.getEntityManager();
    toilet.photoUrl = photoUrl;
    await em.flush();
    return toilet;
  }
}
