import { Entity, OneToOne, Property } from '@mikro-orm/core';
import { CommentEntity } from './comment.entity';

/**
 * Entidade que representa as avaliações detalhadas de um comentário
 * @table comment_rate
 * @description Ratings detalhados de uma casa de banho por um comentário
 */
@Entity({ tableName: 'comment_rate' })
export class CommentRateEntity {
  /**
   * Referência ao comentário associado (chave primária)
   * @field comment
   * @type CommentEntity
   * @nullable false
   * @primary true
   * @relationship one-to-one
   * @description Relação 1:1 com a entidade de comentário (chave estrangeira)
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
   * Classificação de limpeza da casa de banho
   * @field clean
   * @type number
   * @nullable false
   * @range 1-5
   * @description Avaliação de limpeza em escala 1 (péssima) a 5 (excelente)
   */
  @Property({ check: 'clean BETWEEN 1 AND 5' })
  clean!: number;

  /**
   * Indicador de disponibilidade de papel higiénico
   * @field paper
   * @type boolean
   * @nullable false
   * @default varies
   * @description True se havia papel higiénico disponível no momento
   */
  @Property()
  paper!: boolean;

  /**
   * Classificação da estrutura/condição geral
   * @field structure
   * @type number
   * @nullable false
   * @range 1-5
   * @description Avaliação do estado estrutural em escala 1 (péssima) a 5 (excelente)
   */
  @Property({ check: 'structure BETWEEN 1 AND 5' })
  structure!: number;

  /**
   * Classificação de acessibilidade para pessoas com deficiência
   * @field accessibility
   * @type number
   * @nullable false
   * @range 1-5
   * @description Avaliação de acessibilidade em escala 1 (péssima) a 5 (excelente)
   */
  @Property({ check: 'accessibility BETWEEN 1 AND 5' })
  accessibility!: number;
}
