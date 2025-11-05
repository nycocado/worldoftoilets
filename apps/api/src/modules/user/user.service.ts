import { Injectable } from '@nestjs/common';
import { UserEntity, UserIcon } from '@database/entities';
import { UserRepository } from '@modules/user/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getById(id: number): Promise<UserEntity | null> {
    return this.userRepository.findById(id);
  }

  async getByIdOrFail(id: number): Promise<UserEntity> {
    return this.userRepository.findByIdOrFail(id);
  }

  async getByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findByEmail(email);
  }

  async getByRefreshToken(token: string): Promise<UserEntity | null> {
    return this.userRepository.findByRefreshToken(token);
  }

  async getByPublicId(publicId: string): Promise<UserEntity | null> {
    return this.userRepository.findByPublicId(publicId);
  }

  async verityUserExistsByEmail(email: string): Promise<boolean> {
    return this.userRepository.existsByEmail(email);
  }

  async createUser(
    name: string,
    icon: UserIcon | undefined,
    birthDate: string,
  ): Promise<UserEntity> {
    return this.userRepository.create(name, icon, birthDate);
  }
}
