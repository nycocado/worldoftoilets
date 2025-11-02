import { Entity, Index, OneToOne, Property, Unique } from '@mikro-orm/core';
import { UserEntity } from './user.entity';

@Entity({ tableName: 'user_credential' })
export class UserCredentialEntity {
  @OneToOne(() => UserEntity, {
    fieldName: 'id',
    primary: true,
    deleteRule: 'cascade',
    updateRule: 'no action',
    hidden: true,
  })
  user!: UserEntity;

  @Unique()
  @Index({ name: 'idx_user_credential_email' })
  @Property({ length: 100 })
  email!: string;

  @Property({ length: 255 })
  password!: string;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
