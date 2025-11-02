import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { ToiletEntity } from './toilet.entity';
import { UserEntity } from './user.entity';

export enum PartnerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  REJECTED = 'rejected',
}

@Entity({ tableName: 'partner' })
export class PartnerEntity {
  @PrimaryKey()
  id!: number;

  @Unique()
  @Index({ name: 'idx_partner_public_id' })
  @Property({ length: 36, defaultRaw: 'uuid_v4()' })
  publicId!: string;

  @Unique({ name: 'idx_partner_toilet_id' })
  @OneToOne(() => ToiletEntity, {
    owner: true,
    deleteRule: 'cascade',
    updateRule: 'no action',
  })
  toilet!: ToiletEntity;

  @Unique({ name: 'idx_partner_user_id' })
  @OneToOne(() => UserEntity, {
    owner: true,
    deleteRule: 'set null',
    updateRule: 'no action',
    nullable: true,
  })
  user?: UserEntity;

  @Property({ length: 255 })
  certificate!: string;

  @Index({ name: 'idx_partner_contact_email' })
  @Property({ length: 100 })
  contactEmail!: string;

  @Index({ name: 'idx_partner_status' })
  @Enum(() => PartnerStatus)
  status!: PartnerStatus;

  @ManyToOne(() => UserEntity, {
    deleteRule: 'set null',
    updateRule: 'no action',
    nullable: true,
  })
  reviewedBy?: UserEntity;

  @Index({ name: 'idx_partner_reviewed_at' })
  @Property({ nullable: true })
  reviewedAt?: Date;

  @Index({ name: 'idx_partner_created_at' })
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
