import { Injectable, NotFoundException } from '@nestjs/common';
import { ToiletRepository } from '@modules/toilet/toilet.repository';
import { TOILET_EXCEPTIONS } from '@modules/toilet/constants/exceptions.constant';
import { ToiletEntity } from '@database/entities';

@Injectable()
export class ToiletService {
  constructor(private readonly toiletRepository: ToiletRepository) {}

  async getToiletByPublicId(publicId: string): Promise<ToiletEntity> {
    const toilet = await this.toiletRepository.findByPublicId(publicId);
    if (!toilet) {
      throw new NotFoundException(TOILET_EXCEPTIONS.TOILET_NOT_FOUND);
    }
    return toilet;
  }

  async getByFullTextSearch(
    query: string,
    pageable?: boolean,
    page?: number,
    size?: number,
  ): Promise<ToiletEntity[]> {
    return this.toiletRepository.findByFullTextSearch(
      query,
      pageable,
      page,
      size,
    );
  }
}
