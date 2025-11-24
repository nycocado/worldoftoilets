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
 * O status de uma sugestão de nova casa de banho.
 */
export enum SuggestionStatus {
  /** A sugestão está pendente de revisão. */
  PENDING = 'pending',
  /** A sugestão foi aceite e a casa de banho foi criada. */
  ACCEPTED = 'accepted',
  /** A sugestão foi rejeitada. */
  REJECTED = 'rejected',
}

/**
 * Representa uma sugestão de uma nova casa de banho feita por um utilizador.
 * @table suggestion
 */
@Entity({ tableName: 'suggestion' })
export class SuggestionEntity {
  /**
   * Identificador único interno.
   */
  @PrimaryKey()
  id!: number;

  /**
   * A interação que originou esta sugestão.
   */
  @Unique({ name: 'idx_suggestion_interaction_id' })
  @OneToOne(() => InteractionEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
    orphanRemoval: true,
  })
  interaction!: InteractionEntity;

  /**
   * Identificador público (UUID) para partilha externa através da API.
   */
  @Unique()
  @Index({ name: 'idx_suggestion_public_id' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  publicId!: string;

  /**
   * A latitude da localização sugerida.
   */
  @Property({ columnType: 'decimal(10,8)' })
  latitude!: number;

  /**
   * A longitude da localização sugerida.
   */
  @Property({ columnType: 'decimal(10,8)' })
  longitude!: number;

  /**
   * URL de uma foto do local, se fornecida.
   */
  @Property({ length: 255, nullable: true })
  photoUrl?: string;

  /**
   * O status atual da sugestão.
   */
  @Index({ name: 'idx_suggestion_status' })
  @Enum(() => SuggestionStatus)
  @Property({ default: SuggestionStatus.PENDING })
  status: SuggestionStatus = SuggestionStatus.PENDING;

  /**
   * O administrador que reviu a sugestão.
   */
  @ManyToOne(() => UserEntity, {
    deleteRule: 'set null',
    updateRule: 'no action',
    nullable: true,
  })
  reviewedBy?: UserEntity;

  /**
   * Data e hora em que a sugestão foi revista.
   */
  @Index({ name: 'idx_suggestion_reviewed_at' })
  @Property({ nullable: true })
  reviewedAt?: Date;

  /**
   * Data e hora de criação da sugestão.
   */
  @Index({ name: 'idx_suggestion_created_at' })
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  /**
   * Data e hora da última atualização da sugestão.
   */
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  /**
   * O utilizador que fez a sugestão.
   */
  get user(): UserEntity {
    return this.interaction?.user;
  }

  /**
   * A casa de banho associada à sugestão.
   */
  get toilet() {
    return this.interaction?.toilet;
  }
}
