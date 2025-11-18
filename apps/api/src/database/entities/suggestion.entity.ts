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
  @Unique({ name: 'idx_suggestion_interaction_id' })
  @OneToOne(() => InteractionEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
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
   * Latitude da casa de banho sugerida
   * @field latitude
   * @type decimal(10,8)
   * @nullable false
   * @description Latitude em formato decimal (-90 a 90)
   */
  @Property({ columnType: 'decimal(10,8)' })
  latitude!: number;

  /**
   * Longitude da casa de banho sugerida
   * @field longitude
   * @type decimal(10,8)
   * @nullable false
   * @description Longitude em formato decimal (-180 a 180)
   */
  @Property({ columnType: 'decimal(10,8)' })
  longitude!: number;

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

  /**
   * Utilizador que criou a sugestão
   * @field user
   * @type UserEntity
   * @nullable false
   * @description Acesso direto ao utilizador através da interação associada
   */
  get user(): UserEntity {
    return this.interaction?.user;
  }

  /**
   * Casa de banho associada à sugestão
   * @field toilet
   * @type ToiletEntity
   * @nullable false
   * @description Acesso direto à toilet através da interação associada
   */
  get toilet() {
    return this.interaction?.toilet;
  }
}
