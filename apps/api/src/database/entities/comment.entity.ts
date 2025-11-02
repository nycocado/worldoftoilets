import {
  Collection,
  Entity,
  Enum,
  Index,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { InteractionEntity } from './interaction.entity';
import { UserEntity } from './user.entity';
import { CommentRateEntity } from './comment-rate.entity';
import { ReactEntity } from './react.entity';
import { ReplyEntity } from './reply.entity';

export enum CommentState {
  VISIBLE = 'visible',
  HIDDEN = 'hidden',
}

@Entity({ tableName: 'comment' })
export class CommentEntity {
  @PrimaryKey({ hidden: true })
  id!: number;

  @Unique()
  @Index({ name: 'idx_comment_public_id' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  publicId!: string;

  @Unique({ name: 'idx_comment_interaction_id' })
  @OneToOne(() => InteractionEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  interaction!: InteractionEntity;

  @Property({ length: 280 })
  text!: string;

  @Property()
  score!: number;

  @Index({ name: 'idx_comment_state' })
  @Enum(() => CommentState)
  @Property({ default: CommentState.VISIBLE })
  state: CommentState = CommentState.VISIBLE;

  @ManyToOne(() => UserEntity, {
    deleteRule: 'set null',
    updateRule: 'no action',
    nullable: true,
  })
  deletedBy?: UserEntity;

  @Property({ nullable: true })
  deletedAt?: Date;

  @Index({ name: 'idx_comment_created_at' })
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @OneToOne(() => CommentRateEntity, (rate) => rate.comment, {
    nullable: true,
    mappedBy: 'comment',
  })
  rate?: CommentRateEntity;

  @OneToMany(() => ReactEntity, (react) => react.comment)
  reacts = new Collection<ReactEntity>(this);

  @OneToMany(() => ReplyEntity, (reply) => reply.comment)
  replies = new Collection<ReplyEntity>(this);
}
