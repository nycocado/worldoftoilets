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
} from '@mikro-orm/core';
import { UserCredentialEntity } from './user-credential.entity';
import { UserRoleEntity } from './user-role.entity';
import { RefreshTokenEntity } from './refresh-token.entity';
import { RoleEntity } from './role.entity';
import { InteractionEntity } from './interaction.entity';
import { ReactEntity } from './react.entity';
import { ReplyEntity } from './reply.entity';
import { PartnerEntity } from './partner.entity';

export enum UserIcon {
  ICON_1 = 'icon-1',
  ICON_2 = 'icon-2',
  ICON_3 = 'icon-3',
  ICON_4 = 'icon-4',
  ICON_5 = 'icon-5',
  ICON_6 = 'icon-6',
  ICON_DEFAULT = 'icon-default',
}

@Entity({ tableName: 'user' })
export class UserEntity {
  @PrimaryKey({ hidden: true })
  id!: number;

  @Unique()
  @Index({ name: 'idx_user_public_id' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  publicId!: string;

  @Index({ name: 'idx_user_name' })
  @Property({ length: 50 })
  name!: string;

  @Property()
  points: number = 0;

  @Index({ name: 'idx_user_icon' })
  @Enum(() => UserIcon)
  @Property({ default: UserIcon.ICON_DEFAULT })
  icon: UserIcon = UserIcon.ICON_DEFAULT;

  @Index({ name: 'idx_user_birth_date' })
  @Property({ type: 'date' })
  birthDate!: Date;

  @ManyToOne(() => UserEntity, {
    deleteRule: 'set null',
    updateRule: 'no action',
    nullable: true,
  })
  deactivatedBy?: UserEntity;

  @Index({ name: 'idx_user_deactivated_at' })
  @Property({ nullable: true })
  deactivatedAt?: Date;

  @Index({ name: 'idx_user_created_at' })
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @OneToOne(() => UserCredentialEntity, (credential) => credential.user, {
    nullable: true,
    mappedBy: 'user',
  })
  credential?: UserCredentialEntity;

  @ManyToMany({ entity: () => RoleEntity, pivotEntity: () => UserRoleEntity })
  roles = new Collection<RoleEntity>(this);

  @OneToMany(() => RefreshTokenEntity, (token) => token.user)
  refreshTokens = new Collection<RefreshTokenEntity>(this);

  @OneToMany(() => InteractionEntity, (interaction) => interaction.user)
  interactions = new Collection<InteractionEntity>(this);

  @OneToMany(() => ReactEntity, (react) => react.user)
  reacts = new Collection<ReactEntity>(this);

  @OneToMany(() => ReplyEntity, (reply) => reply.user)
  replies = new Collection<ReplyEntity>(this);

  @OneToOne(() => PartnerEntity, (partner) => partner.user, {
    nullable: true,
  })
  partner?: PartnerEntity;
}
