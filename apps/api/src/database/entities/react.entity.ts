import {
  Collection,
  Entity,
  Enum,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { UserEntity } from './user.entity';
import { CommentEntity } from './comment.entity';
import { ReportCommentEntity } from './report-comment.entity';

/**
 * Tipos de reações possíveis a um comentário
 */
export enum ReactDiscriminator {
  /** Reação positiva (like) */
  LIKE = 'like',
  /** Reação negativa (dislike) */
  DISLIKE = 'dislike',
  /** Reação como relatório */
  REPORT = 'report',
}

/**
 * Entidade que representa uma reação de um utilizador a um comentário
 * @table react
 * @description Reação (like/dislike/report) de um utilizador a um comentário
 */
@Entity({ tableName: 'react' })
@Unique({ properties: ['user', 'comment'], name: 'idx_react_user_comment' })
export class ReactEntity {
  /**
   * ID interno da reação
   * @field id
   * @type number
   * @nullable false
   * @primary true
   * @description Identificador único interno
   */
  @PrimaryKey()
  id!: number;

  /**
   * Utilizador que fez a reação
   * @field user
   * @type UserEntity
   * @nullable false
   * @relationship many-to-one
   * @description Usuário criador da reação
   */
  @ManyToOne(() => UserEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  user!: UserEntity;

  /**
   * Comentário que recebeu a reação
   * @field comment
   * @type CommentEntity
   * @nullable false
   * @relationship many-to-one
   * @description Comentário alvo da reação
   */
  @Index({ name: 'idx_react_comment_id' })
  @ManyToOne(() => CommentEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  comment!: CommentEntity;

  /**
   * Tipo de reação
   * @field discriminator
   * @type ReactDiscriminator (enum)
   * @nullable false
   * @description LIKE, DISLIKE ou REPORT (polimórfico)
   */
  @Enum(() => ReactDiscriminator)
  discriminator!: ReactDiscriminator;

  /**
   * Timestamp de criação da reação
   * @field createdAt
   * @type Date
   * @nullable false
   * @default now()
   * @description Data/hora de criação
   */
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
   * Coleção de relatórios associados a esta reação
   * @field reports
   * @type Collection<ReportCommentEntity>
   * @relationship one-to-many
   * @description Relatórios criados quando discriminator === REPORT
   */
  @OneToMany(() => ReportCommentEntity, (report) => report.react)
  reports: Collection<ReportCommentEntity> =
    new Collection<ReportCommentEntity>(this);
}
