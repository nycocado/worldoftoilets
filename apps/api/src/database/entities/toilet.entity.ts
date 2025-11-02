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
} from '@mikro-orm/core';
import { CityEntity } from './city.entity';
import { AccessEntity } from './access.entity';
import { UserEntity } from './user.entity';
import { ExtraEntity } from './extra.entity';
import { InteractionEntity } from './interaction.entity';
import { PartnerEntity } from './partner.entity';

export enum ToiletStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUGGESTED = 'suggested',
  REJECTED = 'rejected',
}

@Entity({ tableName: 'toilet' })
export class ToiletEntity {
  @PrimaryKey({ hidden: true })
  id!: number;

  @Unique()
  @Index({ name: 'idx_toilet_public_id' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  publicId!: string;

  @Index({ name: 'idx_toilet_city_id' })
  @ManyToOne(() => CityEntity, {
    deleteRule: 'no action',
    updateRule: 'no action',
  })
  city!: CityEntity;

  @Index({ name: 'idx_toilet_access_id' })
  @ManyToOne(() => AccessEntity, {
    deleteRule: 'no action',
    updateRule: 'no action',
  })
  access!: AccessEntity;

  @Property({ length: 50 })
  name!: string;

  @Property({ columnType: 'point' })
  coordinates!: string;

  @Property({ length: 255 })
  address!: string;

  @Property({ length: 255, nullable: true })
  photoUrl?: string;

  @Unique()
  @Index({ name: 'idx_toilet_place_id' })
  @Property({ length: 255, nullable: true })
  placeId?: string;

  @Index({ name: 'idx_toilet_status' })
  @Enum(() => ToiletStatus)
  status!: ToiletStatus;

  @ManyToOne(() => UserEntity, {
    deleteRule: 'set null',
    updateRule: 'no action',
    nullable: true,
  })
  reviewedBy?: UserEntity;

  @Index({ name: 'idx_toilet_reviewed_at' })
  @Property({ nullable: true })
  reviewedAt?: Date;

  @ManyToOne(() => UserEntity, {
    deleteRule: 'set null',
    updateRule: 'no action',
    nullable: true,
  })
  deletedBy?: UserEntity;

  @Property({ nullable: true })
  deletedAt?: Date;

  @Index({ name: 'idx_toilet_created_at' })
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @OneToMany(() => ExtraEntity, (extra) => extra.toilet)
  extras = new Collection<ExtraEntity>(this);

  @OneToMany(() => InteractionEntity, (interaction) => interaction.toilet)
  interactions = new Collection<InteractionEntity>(this);

  @OneToOne(() => PartnerEntity, (partner) => partner.toilet, {
    nullable: true,
  })
  partner?: PartnerEntity;
}
