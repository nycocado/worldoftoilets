import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { CommentEntity } from './comment.entity';
import { UserEntity } from './user.entity';

export enum ReplyState {
  VISIBLE = 'visible',
  HIDDEN = 'hidden',
}

@Entity({ tableName: 'reply' })
export class ReplyEntity {
  @PrimaryKey()
  id!: number;

  @Unique()
  @Index({ name: 'idx_reply_public_id' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  publicId!: string;

  @Index({ name: 'idx_reply_comment_id' })
  @ManyToOne(() => CommentEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  comment!: CommentEntity;

  @Index({ name: 'idx_reply_user_id' })
  @ManyToOne(() => UserEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  user!: UserEntity;

  @Property({ length: 280 })
  text!: string;

  @Index({ name: 'idx_reply_state' })
  @Enum(() => ReplyState)
  @Property({ default: ReplyState.VISIBLE })
  state: ReplyState = ReplyState.VISIBLE;

  @ManyToOne(() => UserEntity, {
    deleteRule: 'set null',
    updateRule: 'no action',
    nullable: true,
  })
  deletedBy?: UserEntity;

  @Property({ nullable: true })
  deletedAt?: Date;

  @Index({ name: 'idx_reply_created_at' })
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
