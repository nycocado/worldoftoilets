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

export enum SuggestionStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity({ tableName: 'suggestion' })
export class SuggestionEntity {
  @PrimaryKey()
  id!: number;

  @OneToOne(() => InteractionEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
    primary: true,
  })
  interaction!: InteractionEntity;

  @Unique()
  @Index({ name: 'idx_suggestion_public_id' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  publicId!: string;

  @Property({ columnType: 'point' })
  coordinates!: string;

  @Property({ length: 255, nullable: true })
  photoUrl?: string;

  @Index({ name: 'idx_suggestion_status' })
  @Enum(() => SuggestionStatus)
  @Property({ default: SuggestionStatus.PENDING })
  status: SuggestionStatus = SuggestionStatus.PENDING;

  @ManyToOne(() => UserEntity, {
    deleteRule: 'set null',
    updateRule: 'no action',
    nullable: true,
  })
  reviewedBy?: UserEntity;

  @Index({ name: 'idx_suggestion_reviewed_at' })
  @Property({ nullable: true })
  reviewedAt?: Date;

  @Index({ name: 'idx_suggestion_created_at' })
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
