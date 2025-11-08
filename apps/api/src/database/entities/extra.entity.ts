import { Entity, ManyToOne, PrimaryKey, Unique } from '@mikro-orm/core';
import { ToiletEntity } from './toilet.entity';
import { TypeExtraEntity } from './type-extra.entity';

/**
 * Entidade de junção (Many-to-Many) entre casas de banho e os seus recursos extras
 * @table extra
 * @description Recursos/amenidades disponíveis numa casa de banho
 */
@Entity({ tableName: 'extra' })
@Unique({
  properties: ['toilet', 'typeExtra'],
  name: 'idx_extra_toilet_type',
})
export class ExtraEntity {
  /**
   * ID interno do relacionamento extra
   * @field id
   * @type number
   * @nullable false
   * @primary true
   * @description Identificador único interno
   */
  @PrimaryKey()
  id!: number;

  /**
   * Referência à casa de banho que possui este extra
   * @field toilet
   * @type ToiletEntity
   * @nullable false
   * @relationship many-to-one
   * @description Casa de banho proprietária deste recurso
   */
  @ManyToOne(() => ToiletEntity, {
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  toilet!: ToiletEntity;

  /**
   * Tipo de recurso extra disponível
   * @field typeExtra
   * @type TypeExtraEntity
   * @nullable false
   * @relationship many-to-one
   * @description Tipo de amenidade (ex: wifi, pias, espelho)
   */
  @ManyToOne(() => TypeExtraEntity, {
    deleteRule: 'no action',
    updateRule: 'no action',
  })
  typeExtra!: TypeExtraEntity;
}
