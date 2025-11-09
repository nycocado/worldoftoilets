import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, Transactional } from '@mikro-orm/mariadb';
import { PermissionApiName, UserEntity, UserIcon } from '@database/entities';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: EntityRepository<UserEntity>,
  ) {}

  async hasPermissions(
    userId: number,
    apiNames: PermissionApiName[],
  ): Promise<boolean> {
    const user = await this.repository.findOne(
      {
        id: userId,
        roles: {
          $some: {
            permissions: {
              $some: {
                apiName: { $in: apiNames },
              },
            },
          },
        },
      },
      {
        populate: ['roles', 'roles.permissions'],
      },
    );
    return !!user;
  }

  async findById(userId: number): Promise<UserEntity | null> {
    return await this.repository.findOne(
      { id: userId },
      { populate: ['credential', 'roles'] },
    );
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

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.repository.findOne({ credential: { email } });
    return !!user;
  }

  @Transactional()
  async create(
    name: string,
    icon: UserIcon | undefined,
    birthDate: string,
  ): Promise<UserEntity> {
    const em = this.repository.getEntityManager();
    const user = new UserEntity();
    user.name = name;
    user.icon = icon || UserIcon.ICON_DEFAULT;
    user.birthDate = new Date(birthDate);
    user.points = 0;

    await em.persistAndFlush(user);
    return user;
  }
}
