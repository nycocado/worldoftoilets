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
 * Tipos de interação que um utilizador pode ter com uma casa de banho
 */
export enum InteractionDiscriminator {
  /** Comentário sobre a casa de banho */
  COMMENT = 'comment',
  /** Relatório sobre problemas da casa de banho */
  REPORT = 'report',
  /** Sugestão de nova casa de banho */
  SUGGESTION = 'suggestion',
  /** Simples visualização da casa de banho */
  VIEW = 'view',
}

/**
 * Entidade que representa uma interação entre utilizador e casa de banho
 * @table interaction
 * @description Base para todas as interações do utilizador com o sistema (comentário, relatório, sugestão, visualização)
 */
@Entity({ tableName: 'interaction' })
export class InteractionEntity {
  /**
   * ID interno da interação
   * @field id
   * @type number
   * @nullable false
   * @primary true
   * @hidden true
   * @description Identificador único interno (não exposto na API)
   */
  @PrimaryKey({ hidden: true })
  id!: number;

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
  @Index({ name: 'idx_interaction_public_id' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  publicId!: string;

  /**
   * Referência ao utilizador que realizou a interação
   * @field user
   * @type UserEntity
   * @nullable false
   * @relationship many-to-one
   * @description Usuário que iniciou a interação
   */
  @Index({ name: 'idx_interaction_user_id' })
  @ManyToOne(() => UserEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  user!: UserEntity;

  /**
   * Referência à casa de banho com a qual se interage
   * @field toilet
   * @type ToiletEntity
   * @nullable false
   * @relationship many-to-one
   * @description Casa de banho alvo da interação
   */
  @Index({ name: 'idx_interaction_toilet_id' })
  @ManyToOne(() => ToiletEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  toilet!: ToiletEntity;

  /**
   * Tipo de interação (determina qual entidade relacionada ativa)
   * @field discriminator
   * @type InteractionDiscriminator (enum)
   * @nullable false
   * @description Tipo polimórfico: COMMENT, REPORT, SUGGESTION ou VIEW
   */
  @Index({ name: 'idx_interaction_discriminator' })
  @Enum(() => InteractionDiscriminator)
  discriminator!: InteractionDiscriminator;

  /**
   * Utilizador que apagou a interação
   * @field deletedBy
   * @type UserEntity
   * @nullable true
   * @relationship many-to-one
   * @description Admin/moderador que apagou (soft delete)
   */
  @ManyToOne(() => UserEntity, {
    deleteRule: 'set null',
    updateRule: 'no action',
    nullable: true,
  })
  deletedBy?: UserEntity;

  /**
   * Timestamp da exclusão da interação
   * @field deletedAt
   * @type Date
   * @nullable true
   * @description Data/hora da exclusão (soft delete)
   */
  @Property({ nullable: true })
  deletedAt?: Date;

  /**
   * Timestamp de criação da interação
   * @field createdAt
   * @type Date
   * @nullable false
   * @default now()
   * @description Data/hora de criação
   */
  @Index({ name: 'idx_interaction_created_at' })
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
   * Comentário associado
   * @field comment
   * @type CommentEntity
   * @nullable true
   * @relationship one-to-one
   * @description Preenchido quando discriminator === COMMENT
   */
  @OneToOne(() => CommentEntity, (comment) => comment.interaction, {
    nullable: true,
  })
  comment?: CommentEntity;

  /**
   * Relatório associado
   * @field reportToilet
   * @type ReportToiletEntity
   * @nullable true
   * @relationship one-to-one
   * @description Preenchido quando discriminator === REPORT
   */
  @OneToOne(() => ReportToiletEntity, (report) => report.interaction, {
    nullable: true,
  })
  reportToilet?: ReportToiletEntity;

  /**
   * Sugestão associada
   * @field suggestion
   * @type SuggestionEntity
   * @nullable true
   * @relationship one-to-one
   * @description Preenchido quando discriminator === SUGGESTION
   */
  @OneToOne(() => SuggestionEntity, (suggestion) => suggestion.interaction, {
    nullable: true,
  })
  suggestion?: SuggestionEntity;
}
