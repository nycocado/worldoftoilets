import { Entity, OneToOne, Property } from '@mikro-orm/core';
import { CommentEntity } from './comment.entity';

/**
 * Armazena as avaliações detalhadas (limpeza, estrutura, etc.) de um comentário.
 * @table comment_rate
 */
@Entity({ tableName: 'comment_rate' })
export class CommentRateEntity {
  /**
   * O comentário ao qual esta avaliação está associada.
   */
  @OneToOne(() => CommentEntity, {
    fieldName: 'id',
    primary: true,
    deleteRule: 'cascade',
    updateRule: 'no action',
    hidden: true,
  })
  comment!: CommentEntity;

  /**
   * Avaliação de limpeza, em uma escala de 1 a 5.
   */
  @Property({ check: 'clean BETWEEN 1 AND 5' })
  clean!: number;

  /**
   * Indica se havia papel higiênico disponível.
   */
  @Property()
  paper!: boolean;

  /**
   * Avaliação da estrutura e condição geral, em uma escala de 1 a 5.
   */
  @Property({ check: 'structure BETWEEN 1 AND 5' })
  structure!: number;

  /**
   * Avaliação de acessibilidade para pessoas com deficiência, em uma escala de 1 a 5.
   */
  @Property({ check: 'accessibility BETWEEN 1 AND 5' })
  accessibility!: number;
}
