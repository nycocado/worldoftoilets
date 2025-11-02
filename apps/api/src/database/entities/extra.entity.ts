import { Entity, ManyToOne, PrimaryKey, Unique } from '@mikro-orm/core';
import { ToiletEntity } from './toilet.entity';
import { TypeExtraEntity } from './type-extra.entity';

@Entity({ tableName: 'extra' })
@Unique({
  properties: ['toilet', 'typeExtra'],
  name: 'idx_extra_toilet_type',
})
export class ExtraEntity {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => ToiletEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  toilet!: ToiletEntity;

  @ManyToOne(() => TypeExtraEntity, {
    deleteRule: 'no action',
    updateRule: 'no action',
  })
  typeExtra!: TypeExtraEntity;
}
