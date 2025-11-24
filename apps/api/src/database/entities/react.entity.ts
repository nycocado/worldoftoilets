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
 * Tipos de reações a um comentário.
 */
export enum ReactDiscriminator {
  /** Reação positiva (like). */
  LIKE = 'like',
  /** Reação negativa (dislike). */
  DISLIKE = 'dislike',
  /** Reação do tipo denúncia. */
  REPORT = 'report',
}

/**
 * Representa uma reação de um utilizador a um comentário.
 * @table react
 */
@Entity({ tableName: 'react' })
@Unique({ properties: ['user', 'comment'], name: 'idx_react_user_comment' })
export class ReactEntity {
  /**
   * Identificador único interno.
   */
  @PrimaryKey()
  id!: number;

  /**
   * O utilizador que realizou a reação.
   */
  @ManyToOne(() => UserEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  user!: UserEntity;

  /**
   * O comentário que recebeu a reação.
   */
  @Index({ name: 'idx_react_comment_id' })
  @ManyToOne(() => CommentEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  comment!: CommentEntity;

  /**
   * O tipo de reação (like, dislike ou denúncia).
   */
  @Enum(() => ReactDiscriminator)
  discriminator!: ReactDiscriminator;

  /**
   * Data e hora de criação da reação.
   */
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  /**
   * Data e hora da última atualização da reação.
   */
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  /**
   * A denúncia associada (apenas se o discriminador for 'REPORT').
   */
  @OneToMany(() => ReportCommentEntity, (report) => report.react)
  reports: Collection<ReportCommentEntity> =
    new Collection<ReportCommentEntity>(this);
}
