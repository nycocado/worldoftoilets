import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { UserEntity, UserIcon } from '@database/entities';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: EntityRepository<UserEntity>,
  ) {}

  async findById(id: number): Promise<UserEntity | null> {
    return await this.repository.findOne({ id }, { populate: ['roles'] });
  }

  async findByIdOrFail(id: number): Promise<UserEntity> {
    return await this.repository.findOneOrFail({ id }, { populate: ['roles'] });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.repository.findOne(
      { credential: { email } },
      { populate: ['credential', 'roles'] },
    );
  }

  async findByRefreshToken(token: string): Promise<UserEntity | null> {
    return await this.repository.findOne(
      { refreshTokens: { token } },
      { populate: ['roles'] },
    );
  }

  async findByPublicId(publicId: string): Promise<UserEntity | null> {
    return await this.repository.findOne({ publicId }, { populate: ['roles'] });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.repository.findOne({ credential: { email } });
    return !!user;
  }

  async create(
    name: string,
    icon: UserIcon | undefined,
    birthDate: string,
  ): Promise<UserEntity> {
    const em = this.getEntityManager();
    const user = new UserEntity();
    user.name = name;
    user.icon = icon || UserIcon.ICON_DEFAULT;
    user.birthDate = new Date(birthDate);
    user.points = 0;

    await em.persistAndFlush(user);
    return user;
  }

  private getEntityManager(): EntityManager {
    return this.repository.getEntityManager();
  }
}
