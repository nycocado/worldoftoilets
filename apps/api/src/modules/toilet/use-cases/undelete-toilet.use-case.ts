import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { ToiletRepository } from '@modules/toilet/toilet.repository';
import { TOILET_EXCEPTIONS } from '@modules/toilet/constants/exceptions.constant';

@Injectable()
export class UndeleteToiletUseCase {
  constructor(private readonly repository: ToiletRepository) {}

  @Transactional()
  async execute(publicId: string): Promise<void> {
    const toilet = await this.repository.findByPublicId(publicId);

    if (!toilet) {
      throw new NotFoundException(TOILET_EXCEPTIONS.TOILET_NOT_FOUND);
    }

    if (!toilet.deletedBy || !toilet.deletedAt) {
      throw new ConflictException(TOILET_EXCEPTIONS.TOILET_NOT_DELETED);
    }

    await this.repository.undelete(toilet);
  }
}
