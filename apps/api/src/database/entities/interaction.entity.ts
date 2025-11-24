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
import { UserEntity } from './user.entity';
import { ToiletEntity } from './toilet.entity';
import { CommentEntity } from './comment.entity';
import { ReportToiletEntity } from './report-toilet.entity';
import { SuggestionEntity } from './suggestion.entity';

/**
 * Tipos de interação que um utilizador pode ter com uma casa de banho.
 */
export enum InteractionDiscriminator {
  /** Interação do tipo comentário. */
  COMMENT = 'comment',
  /** Interação do tipo denúncia de uma casa de banho. */
  REPORT = 'report',
  /** Interação do tipo sugestão de uma nova casa de banho. */
  SUGGESTION = 'suggestion',
  /** Interação do tipo visualização de uma casa de banho. */
  VIEW = 'view',
}

/**
 * Representa a base para todas as interações entre um utilizador e uma casa de banho.
 * @table interaction
 */
@Entity({ tableName: 'interaction' })
export class InteractionEntity {
  /**
   * Identificador único interno.
   */
  @PrimaryKey({ hidden: true })
  id!: number;

  /**
   * Identificador público (UUID) para partilha externa através da API.
   */
  @Unique()
  @Index({ name: 'idx_interaction_public_id' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  publicId!: string;

  /**
   * O utilizador que realizou a interação.
   */
  @Index({ name: 'idx_interaction_user_id' })
  @ManyToOne(() => UserEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  user!: UserEntity;

  /**
   * A casa de banho que é alvo da interação.
   */
  @Index({ name: 'idx_interaction_toilet_id' })
  @ManyToOne(() => ToiletEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  toilet!: ToiletEntity;

  /**
   * O tipo de interação, que determina qual entidade relacionada é populada.
   */
  @Index({ name: 'idx_interaction_discriminator' })
  @Enum(() => InteractionDiscriminator)
  discriminator!: InteractionDiscriminator;

  /**
   * Referência ao administrador que realizou o soft delete.
   */
  @ManyToOne(() => UserEntity, {
    deleteRule: 'set null',
    updateRule: 'no action',
    nullable: true,
  })
  deletedBy?: UserEntity;

  /**
   * Data e hora da exclusão (para soft delete).
   */
  @Property({ nullable: true })
  deletedAt?: Date;

  /**
   * Data e hora de criação da interação.
   */
  @Index({ name: 'idx_interaction_created_at' })
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  /**
   * Data e hora da última atualização da interação.
   */
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  /**
   * O comentário associado (apenas se o discriminador for 'COMMENT').
   */
  @OneToOne(() => CommentEntity, (comment) => comment.interaction, {
    nullable: true,
  })
  comment?: CommentEntity;

  /**
   * A denúncia associada (apenas se o discriminador for 'REPORT').
   */
  @OneToOne(() => ReportToiletEntity, (report) => report.interaction, {
    nullable: true,
  })
  reportToilet?: ReportToiletEntity;

  /**
   * A sugestão associada (apenas se o discriminador for 'SUGGESTION').
   */
  @OneToOne(() => SuggestionEntity, (suggestion) => suggestion.interaction, {
    nullable: true,
  })
  suggestion?: SuggestionEntity;
}
