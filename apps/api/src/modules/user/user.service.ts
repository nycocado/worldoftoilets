import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { UserEntity } from '@database/entities';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>,
  ) {}

  async getById(id: number): Promise<UserEntity> {
    return await this.userRepository.findOneOrFail(
      { id },
      { populate: ['roles'] },
    );
  }

  async getByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOneOrFail(
      { credential: { email } },
      { populate: ['credential', 'roles'] },
    );
  }

  async getByRefreshToken(token: string): Promise<UserEntity> {
    return await this.userRepository.findOneOrFail(
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
}
