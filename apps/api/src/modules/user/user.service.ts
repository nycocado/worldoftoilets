import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { UserEntity, UserIcon } from '@database/entities';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>,
  ) {}

  async getById(id: number): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ id }, { populate: ['roles'] });
  }

  async getByIdOrFail(id: number): Promise<UserEntity> {
    return await this.userRepository.findOneOrFail(
      { id },
      { populate: ['roles'] },
    );
  }

  async getByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne(
      { credential: { email } },
      { populate: ['credential', 'roles'] },
    );
  }

  async getByRefreshToken(token: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne(
      { refreshTokens: { token } },
      { populate: ['roles'] },
    );
  }

  async getByPublicId(publicId: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne(
      { publicId },
      { populate: ['roles'] },
    );
  }

  async verityUserExistsByEmail(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ credential: { email } });
    return !!user;
  }

  async createUser(
    name: string,
    icon: UserIcon | undefined,
    birthDate: string,
  ): Promise<UserEntity> {
    const em = this.userRepository.getEntityManager();
    const user = new UserEntity();
    user.name = name;
    user.icon = icon || UserIcon.ICON_DEFAULT;
    user.birthDate = new Date(birthDate);
    user.points = 0;

    await em.persistAndFlush(user);
    return user;
  }
}
