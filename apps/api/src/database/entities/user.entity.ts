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
 * Ícones de perfil disponíveis para utilizadores
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
 * Entidade que representa um utilizador no sistema
 * @table user
 * @description Usuário do sistema World of Toilets com perfil e papéis associados
 */
@Entity({ tableName: 'user' })
export class UserEntity {
  /**
   * ID interno do utilizador
   * @field id
   * @type number
   * @nullable false
   * @primary true
   * @hidden true
   * @description Identificador único interno (não exposto na API)
   */
  @PrimaryKey({ hidden: true })
  id!: number;

  /**
   * ID público em formato UUID
   * @field publicId
   * @type string (UUID)
   * @nullable false
   * @unique true
   * @length 36
   * @default uuid_v4()
   * @description Identificador público para referência externa
   */
  @Unique()
  @Index({ name: 'idx_user_public_id' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  publicId!: string;

  /**
   * Nome exibido do utilizador
   * @field name
   * @type string
   * @nullable false
   * @length 50
   * @description Nome público do utilizador (alcunha/display name)
   */
  @Index({ name: 'idx_user_name' })
  @Property({ length: 50 })
  name!: string;

  /**
   * Pontos acumulados pelo utilizador
   * @field points
   * @type number
   * @nullable false
   * @default 0
   * @description Pontos do sistema de gamificação
   */
  @Property()
  points: number = 0;

  /**
   * Ícone/avatar selecionado pelo utilizador
   * @field icon
   * @type UserIcon (enum)
   * @nullable false
   * @default ICON_DEFAULT
   * @description Avatar/ícone escolhido pelo usuário
   */
  @Index({ name: 'idx_user_icon' })
  @Enum(() => UserIcon)
  @Property({ default: UserIcon.ICON_DEFAULT })
  icon: UserIcon = UserIcon.ICON_DEFAULT;

  /**
   * Data de nascimento do utilizador
   * @field birthDate
   * @type Date
   * @nullable false
   * @type date
   * @description Data de nascimento para confirmação de idade
   */
  @Index({ name: 'idx_user_birth_date' })
  @Property({ type: 'date' })
  birthDate!: Date;

  /**
   * Utilizador administrador que desativou esta conta
   * @field deactivatedBy
   * @type UserEntity
   * @nullable true
   * @relationship many-to-one
   * @description Admin que desativou a conta (se aplicável)
   */
  @ManyToOne(() => UserEntity, {
    deleteRule: 'set null',
    updateRule: 'no action',
    nullable: true,
  })
  deactivatedBy?: UserEntity;

  /**
   * Timestamp de desativação da conta
   * @field deactivatedAt
   * @type Date
   * @nullable true
   * @description Data/hora de desativação (soft delete)
   */
  @Index({ name: 'idx_user_deactivated_at' })
  @Property({ nullable: true })
  deactivatedAt?: Date;

  /**
   * Timestamp de criação da conta
   * @field createdAt
   * @type Date
   * @nullable false
   * @default now()
   * @description Data/hora de criação da conta
   */
  @Index({ name: 'idx_user_created_at' })
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  /**
   * Timestamp da última atualização
   * @field updatedAt
   * @type Date
   * @nullable false
   * @default now()
   * @description Data/hora da última modificação
   */
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  /**
   * Credenciais de autenticação do utilizador
   * @field credential
   * @type UserCredentialEntity
   * @nullable true
   * @relationship one-to-one
   * @description Email, senha e tokens de verificação
   */
  @OneToOne(() => UserCredentialEntity, (credential) => credential.user, {
    nullable: true,
    mappedBy: 'user',
  })
  credential?: UserCredentialEntity;

  /**
   * Coleção de papéis atribuídos ao utilizador
   * @field roles
   * @type Collection<RoleEntity>
   * @relationship many-to-many
   * @description Papéis/roles que determinam permissões
   */
  @ManyToMany({ entity: () => RoleEntity, pivotEntity: () => UserRoleEntity })
  roles: Collection<RoleEntity> = new Collection<RoleEntity>(this);

  /**
   * Coleção de tokens de refresh do utilizador
   * @field refreshTokens
   * @type Collection<RefreshTokenEntity>
   * @relationship one-to-many
   * @description Tokens ativos para renovação de sessão
   */
  @OneToMany(() => RefreshTokenEntity, (token) => token.user)
  refreshTokens: Collection<RefreshTokenEntity> =
    new Collection<RefreshTokenEntity>(this);

  /**
   * Coleção de interações do utilizador
   * @field interactions
   * @type Collection<InteractionEntity>
   * @relationship one-to-many
   * @description Comentários, relatórios, sugestões, visualizações
   */
  @OneToMany(() => InteractionEntity, (interaction) => interaction.user)
  interactions: Collection<InteractionEntity> =
    new Collection<InteractionEntity>(this);

  /**
   * Coleção de reações do utilizador
   * @field reacts
   * @type Collection<ReactEntity>
   * @relationship one-to-many
   * @description Likes/dislikes/reports a comentários
   */
  @OneToMany(() => ReactEntity, (react) => react.user)
  reacts: Collection<ReactEntity> = new Collection<ReactEntity>(this);

  /**
   * Coleção de respostas criadas pelo utilizador
   * @field replies
   * @type Collection<ReplyEntity>
   * @relationship one-to-many
   * @description Respostas em threads de comentários
   */
  @OneToMany(() => ReplyEntity, (reply) => reply.user)
  replies: Collection<ReplyEntity> = new Collection<ReplyEntity>(this);

  /**
   * Parceria do utilizador com uma casa de banho
   * @field partner
   * @type PartnerEntity
   * @nullable true
   * @relationship one-to-one
   * @description Dados de parceria (se aplicável)
   */
  @OneToOne(() => PartnerEntity, (partner) => partner.user, {
    nullable: true,
  })
  partner?: PartnerEntity;

  /**
   * Total de comentários feitos pelo utilizador
   * @field commentsCount
   * @type number
   * @nullable true
   * @transient true
   * @description Contagem total de comentários visíveis (não persistido)
   */
  @Formula(
    (alias) =>
      `(SELECT COUNT(*) FROM interaction i 
    INNER JOIN comment c ON c.interaction_id = i.id 
    WHERE i.user_id = ${alias}.id 
    AND i.discriminator = '${InteractionDiscriminator.COMMENT}'
    AND c.state = '${CommentState.VISIBLE}')`,
  )
  commentsCount: number = 0;

  /**
   * Email do utilizador
   * @field email
   * @type string
   * @nullable true
   * @transient true
   * @description Email extraído das credenciais (se existirem)
   */
  get email(): string | null {
    return this.credential?.email || null;
  }

  /**
   * Indica se o utilizador é parceiro
   * @field isPartner
   * @type boolean
   * @nullable false
   * @transient true
   * @description True se o utilizador tiver uma parceria ativa
   */
  get isPartner(): boolean {
    return !!this.partner;
  }
}
