import { Entity, ManyToOne, PrimaryKey, Unique } from '@mikro-orm/core';
import { ToiletEntity } from './toilet.entity';
import { TypeExtraEntity } from './type-extra.entity';

/**
 * Entidade de junção que associa um recurso extra a uma casa de banho.
 * @table extra
 */
@Entity({ tableName: 'extra' })
@Unique({
  properties: ['toilet', 'typeExtra'],
  name: 'idx_extra_toilet_type',
})
export class ExtraEntity {
  /**
   * Identificador único interno.
   */
  @PrimaryKey()
  id!: number;

  /**
   * A casa de banho que possui o recurso.
   */
  @ManyToOne(() => ToiletEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  toilet!: ToiletEntity;

  /**
   * O tipo de recurso extra associado.
   */
  @ManyToOne(() => TypeExtraEntity, {
    deleteRule: 'no action',
    updateRule: 'no action',
  })
  typeExtra!: TypeExtraEntity;
}
