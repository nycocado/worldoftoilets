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
  ManyToMany,
  Formula,
} from '@mikro-orm/core';
import { UserCredentialEntity } from './user-credential.entity';
import { UserRoleEntity } from './user-role.entity';
import { RefreshTokenEntity } from './refresh-token.entity';
import { RoleEntity } from './role.entity';
import {
  InteractionDiscriminator,
  InteractionEntity,
} from './interaction.entity';
import { ReactEntity } from './react.entity';
import { ReplyEntity } from './reply.entity';
import { PartnerEntity } from './partner.entity';
import { CommentState } from '@database/entities/comment.entity';

/**
 * Ícones de perfil disponíveis para o utilizador.
 */
export enum UserIcon {
  ICON_1 = 'icon-1',
  ICON_2 = 'icon-2',
  ICON_3 = 'icon-3',
  ICON_4 = 'icon-4',
  ICON_5 = 'icon-5',
  ICON_6 = 'icon-6',
  ICON_DEFAULT = 'icon-default',
}

/**
 * Representa um utilizador do sistema.
 * @table user
 */
@Entity({ tableName: 'user' })
export class UserEntity {
  /**
   * Identificador único interno.
   */
  @PrimaryKey({ hidden: true })
  id!: number;

  /**
   * Identificador público (UUID) para partilha externa através da API.
   */
  @Unique()
  @Index({ name: 'idx_user_public_id' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  publicId!: string;

  /**
   * Nome de exibição público do utilizador.
   */
  @Index({ name: 'idx_user_name' })
  @Property({ length: 50 })
  name!: string;

  /**
   * Pontos de gamificação acumulados pelo utilizador.
   */
  @Property()
  points: number = 0;

  /**
   * Ícone de perfil selecionado pelo utilizador.
   */
  @Index({ name: 'idx_user_icon' })
  @Enum(() => UserIcon)
  @Property({ default: UserIcon.ICON_DEFAULT })
  icon: UserIcon = UserIcon.ICON_DEFAULT;

  /**
   * Data de nascimento do utilizador.
   */
  @Index({ name: 'idx_user_birth_date' })
  @Property({ type: 'date' })
  birthDate!: Date;

  /**
   * O administrador que desativou a conta (soft delete).
   */
  @ManyToOne(() => UserEntity, {
    deleteRule: 'set null',
    updateRule: 'no action',
    nullable: true,
  })
  deactivatedBy?: UserEntity;

  /**
   * Data e hora da desativação da conta (para soft delete).
   */
  @Index({ name: 'idx_user_deactivated_at' })
  @Property({ nullable: true })
  deactivatedAt?: Date;

  /**
   * Data e hora de criação da conta.
   */
  @Index({ name: 'idx_user_created_at' })
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  /**
   * Data e hora da última atualização da conta.
   */
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  /**
   * As credenciais de autenticação do utilizador.
   */
  @OneToOne(() => UserCredentialEntity, (credential) => credential.user, {
    nullable: true,
    mappedBy: 'user',
  })
  credential?: UserCredentialEntity;

  /**
   * Coleção de papéis que definem as permissões do utilizador.
   */
  @ManyToMany({ entity: () => RoleEntity, pivotEntity: () => UserRoleEntity })
  roles: Collection<RoleEntity> = new Collection<RoleEntity>(this);

  /**
   * Coleção de tokens de atualização para gestão de sessão.
   */
  @OneToMany(() => RefreshTokenEntity, (token) => token.user)
  refreshTokens: Collection<RefreshTokenEntity> =
    new Collection<RefreshTokenEntity>(this);

  /**
   * Coleção de todas as interações feitas pelo utilizador.
   */
  @OneToMany(() => InteractionEntity, (interaction) => interaction.user)
  interactions: Collection<InteractionEntity> =
    new Collection<InteractionEntity>(this);

  /**
   * Coleção de todas as reações feitas pelo utilizador.
   */
  @OneToMany(() => ReactEntity, (react) => react.user)
  reacts: Collection<ReactEntity> = new Collection<ReactEntity>(this);

  /**
   * Coleção de todas as respostas criadas pelo utilizador.
   */
  @OneToMany(() => ReplyEntity, (reply) => reply.user)
  replies: Collection<ReplyEntity> = new Collection<ReplyEntity>(this);

  /**
   * A parceria associada a este utilizador, se existir.
   */
  @OneToOne(() => PartnerEntity, (partner) => partner.user, {
    nullable: true,
  })
  partner?: PartnerEntity;

  /**
   * Contagem total de comentários visíveis feitos pelo utilizador (calculado).
   */
  @Formula(
    (alias) =>
      `(SELECT COUNT(*) FROM interaction i 
    INNER JOIN comment c ON c.interaction_id = i.id 
    WHERE i.user_id = ${alias}.id 
    AND i.discriminator = '${InteractionDiscriminator.COMMENT}'
    AND c.state = '${CommentState.VISIBLE}')`,
    { lazy: true },
  )
  commentsCount: number = 0;

  /**
   * O e-mail do utilizador (obtido a partir das credenciais).
   */
  get email(): string | null {
    return this.credential?.email || null;
  }

  /**
   * Indica se o utilizador tem uma parceria ativa.
   */
  get isPartner(): boolean {
    return !!this.partner;
  }
}
