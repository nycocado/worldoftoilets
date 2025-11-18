import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { ToiletRepository } from '@modules/toilet/toilet.repository';
import { UserService } from '@modules/user';
import { TOILET_EXCEPTIONS } from '@modules/toilet/constants/exceptions.constant';
import { ToiletStatus } from '@database/entities';

@Injectable()
export class PublishToiletUseCase {
  constructor(
    private readonly repository: ToiletRepository,
    private readonly userService: UserService,
  ) {}

  @Transactional()
  async execute(publicId: string, userPublicId: string): Promise<void> {
    const toilet = await this.repository.findByPublicId(publicId);

    if (!toilet) {
      throw new NotFoundException(TOILET_EXCEPTIONS.TOILET_NOT_FOUND);
    }

    if (toilet.deletedBy && toilet.deletedAt) {
      throw new ConflictException(TOILET_EXCEPTIONS.TOILET_DELETED);
    }

    if (toilet.status !== ToiletStatus.SUGGESTED) {
      throw new ConflictException(TOILET_EXCEPTIONS.TOILET_NOT_SUGGESTED);
    }

    const user = await this.userService.getUserByPublicId(userPublicId);

    await this.repository.publish(toilet, user);
  }
}
