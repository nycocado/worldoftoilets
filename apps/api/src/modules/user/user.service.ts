import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PermissionApiName, UserEntity, UserIcon } from '@database/entities';
import { UserRepository } from '@modules/user/user.repository';
import { USER_EXCEPTIONS } from '@modules/user/constants/exceptions.constant';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(USER_EXCEPTIONS.USER_NOT_FOUND);
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new BadRequestException(USER_EXCEPTIONS.USER_NOT_FOUND);
    }

    return user;
  }

  async getUserByRefreshToken(token: string): Promise<UserEntity> {
    const user = await this.userRepository.findByRefreshToken(token);

    if (!user) {
      throw new NotFoundException(USER_EXCEPTIONS.USER_NOT_FOUND);
    }

    return user;
  }

  async verityUserExistsByEmail(email: string): Promise<boolean> {
    return this.userRepository.existsByEmail(email);
  }

  async verifyUserHasPermissions(
    userId: number,
    apiNames: PermissionApiName[],
  ): Promise<boolean> {
    return this.userRepository.hasPermissions(userId, apiNames);
  }

  async createUser(
    name: string,
    icon: UserIcon | undefined,
    birthDate: string,
  ): Promise<UserEntity> {
    return this.userRepository.create(name, icon, birthDate);
  }
}
