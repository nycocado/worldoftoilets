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

export enum InteractionDiscriminator {
  COMMENT = 'comment',
  REPORT = 'report',
  SUGGESTION = 'suggestion',
  VIEW = 'view',
}

@Entity({ tableName: 'interaction' })
export class InteractionEntity {
  @PrimaryKey({ hidden: true })
  id!: number;

  @Unique()
  @Index({ name: 'idx_interaction_public_id' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  publicId!: string;

  @Index({ name: 'idx_interaction_user_id' })
  @ManyToOne(() => UserEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  user!: UserEntity;

  @Index({ name: 'idx_interaction_toilet_id' })
  @ManyToOne(() => ToiletEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  toilet!: ToiletEntity;

  @Index({ name: 'idx_interaction_discriminator' })
  @Enum(() => InteractionDiscriminator)
  discriminator!: InteractionDiscriminator;

  @ManyToOne(() => UserEntity, {
    deleteRule: 'set null',
    updateRule: 'no action',
    nullable: true,
  })
  deletedBy?: UserEntity;

  @Property({ nullable: true })
  deletedAt?: Date;

  @Index({ name: 'idx_interaction_created_at' })
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @OneToOne(() => CommentEntity, (comment) => comment.interaction, {
    nullable: true,
  })
  comment?: CommentEntity;

  @OneToOne(() => ReportToiletEntity, (report) => report.interaction, {
    nullable: true,
  })
  reportToilet?: ReportToiletEntity;

  @OneToOne(() => SuggestionEntity, (suggestion) => suggestion.interaction, {
    nullable: true,
  })
  suggestion?: SuggestionEntity;
}
