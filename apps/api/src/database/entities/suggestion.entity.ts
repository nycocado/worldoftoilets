import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { InteractionEntity } from './interaction.entity';
import { UserEntity } from './user.entity';

/**
 * Estados possíveis de uma sugestão de casa de banho
 */
export enum SuggestionStatus {
  /** Sugestão pendente de revisão */
  PENDING = 'pending',
  /** Sugestão aceita e casa de banho criado */
  ACCEPTED = 'accepted',
  /** Sugestão rejeitada */
  REJECTED = 'rejected',
}

/**
 * Entidade que representa uma sugestão de nova casa de banho
 * @table suggestion
 * @description Sugestão de um novo local para adicionar ao sistema
 */
@Entity({ tableName: 'suggestion' })
export class SuggestionEntity {
  /**
   * ID interno da sugestão
   * @field id
   * @type number
   * @nullable false
   * @primary true
   * @description Identificador único interno
   */
  @PrimaryKey()
  id!: number;

  /**
   * Interação base associada à sugestão
   * @field interaction
   * @type InteractionEntity
   * @nullable false
   * @relationship one-to-one
   * @primary true
   * @description Interação que originou esta sugestão
   */
  @OneToOne(() => InteractionEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
    primary: true,
    orphanRemoval: true,
  })
  interaction!: InteractionEntity;

  /**
   * ID público em formato UUID
   * @field publicId
   * @type string (UUID)
   * @nullable false
   * @unique true
   * @length 36
   * @default uuid_v4()
   * @description Identificador público para referência externa
   */
  @Unique()
  @Index({ name: 'idx_suggestion_public_id' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  publicId!: string;

  /**
   * Coordenadas geográficas da casa de banho sugerida
   * @field coordinates
   * @type string
   * @nullable false
   * @type point (PostGIS)
   * @description Localização em formato PostGIS point
   */
  @Property({ columnType: 'point' })
  coordinates!: string;

  /**
   * URL da foto da casa de banho sugerida
   * @field photoUrl
   * @type string
   * @nullable true
   * @length 255
   * @description Link para foto/imagem do local proposto
   */
  @Property({ length: 255, nullable: true })
  photoUrl?: string;

  /**
   * Status atual da sugestão
   * @field status
   * @type SuggestionStatus (enum)
   * @nullable false
   * @default PENDING
   * @description PENDING, ACCEPTED ou REJECTED
   */
  @Index({ name: 'idx_suggestion_status' })
  @Enum(() => SuggestionStatus)
  @Property({ default: SuggestionStatus.PENDING })
  status: SuggestionStatus = SuggestionStatus.PENDING;

  /**
   * Utilizador que revisou a sugestão
   * @field reviewedBy
   * @type UserEntity
   * @nullable true
   * @relationship many-to-one
   * @description Admin que revisou/aprovou (se aplicável)
   */
  @ManyToOne(() => UserEntity, {
    deleteRule: 'set null',
    updateRule: 'no action',
    nullable: true,
  })
  reviewedBy?: UserEntity;

  /**
   * Timestamp da revisão da sugestão
   * @field reviewedAt
   * @type Date
   * @nullable true
   * @description Data/hora de revisão/aprovação
   */
  @Index({ name: 'idx_suggestion_reviewed_at' })
  @Property({ nullable: true })
  reviewedAt?: Date;

  /**
   * Timestamp de criação da sugestão
   * @field createdAt
   * @type Date
   * @nullable false
   * @default now()
   * @description Data/hora de criação da sugestão
   */
  @Index({ name: 'idx_suggestion_created_at' })
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  /**
   * Timestamp da última atualização
   * @field updatedAt
   * @type Date
   * @nullable false
   * @default now()
   * @description Data/hora da última modificação
   */
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
