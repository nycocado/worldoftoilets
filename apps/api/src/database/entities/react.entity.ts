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

export enum ReactDiscriminator {
  LIKE = 'like',
  DISLIKE = 'dislike',
  REPORT = 'report',
}

@Entity({ tableName: 'react' })
@Unique({ properties: ['user', 'comment'], name: 'idx_react_user_comment' })
export class ReactEntity {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => UserEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  user!: UserEntity;

  @Index({ name: 'idx_react_comment_id' })
  @ManyToOne(() => CommentEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  comment!: CommentEntity;

  @Enum(() => ReactDiscriminator)
  discriminator!: ReactDiscriminator;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @OneToMany(() => ReportCommentEntity, (report) => report.react)
  reports = new Collection<ReportCommentEntity>(this);
}
