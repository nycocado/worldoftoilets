import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { ToiletRepository } from '@modules/toilet/toilet.repository';
import { ToiletStatus } from '@database/entities';
import { ToiletResponseDto } from '@modules/toilet/dto';
import { TOILET_EXCEPTIONS } from '@modules/toilet/constants/exceptions.constant';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class EnableToiletUseCase {
  constructor(private readonly repository: ToiletRepository) {}

  @Transactional()
  async execute(publicId: string): Promise<ToiletResponseDto> {
    const toilet = await this.repository.findByPublicId(publicId);

    if (!toilet) {
      throw new NotFoundException(TOILET_EXCEPTIONS.TOILET_NOT_FOUND);
    }

    if (toilet.deletedBy && toilet.deletedAt) {
      throw new ConflictException(TOILET_EXCEPTIONS.TOILET_DELETED);
    }

    if (toilet.status === ToiletStatus.ACTIVE) {
      return plainToInstance(ToiletResponseDto, toilet, {
        excludeExtraneousValues: true,
      });
    }

    await this.repository.changeStatus(toilet, ToiletStatus.ACTIVE);

    return plainToInstance(ToiletResponseDto, toilet, {
      excludeExtraneousValues: true,
    });
  }
}
