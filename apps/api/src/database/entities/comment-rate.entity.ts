import { Entity, OneToOne, Property } from '@mikro-orm/core';
import { CommentEntity } from './comment.entity';

@Entity({ tableName: 'comment_rate' })
export class CommentRateEntity {
  @OneToOne(() => CommentEntity, {
    fieldName: 'id',
    primary: true,
    deleteRule: 'cascade',
    updateRule: 'no action',
    hidden: true,
  })
  comment!: CommentEntity;

  @Property({ check: 'clean BETWEEN 1 AND 5' })
  clean!: number;

  @Property()
  paper!: boolean;

  @Property({ check: 'structure BETWEEN 1 AND 5' })
  structure!: number;

  @Property({ check: 'accessibility BETWEEN 1 AND 5' })
  accessibility!: number;
}
