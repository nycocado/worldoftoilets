import { Injectable, NotFoundException } from '@nestjs/common';
import { ToiletRepository } from '@modules/toilet';
import { EnrichToiletsWithCommentRateUseCase } from '@modules/toilet/use-cases/enrich-toilets-with-comment-rate.use-case';
import { TOILET_EXCEPTIONS } from '@modules/toilet/constants/exceptions.constant';
import { ToiletResponseDto } from '@modules/toilet/dto';

@Injectable()
export class GetToiletByPublicIdUseCase {
  constructor(
    private readonly repository: ToiletRepository,
    private readonly enrichToiletWithCommentRate: EnrichToiletsWithCommentRateUseCase,
  ) {}

  async execute(publicId: string): Promise<ToiletResponseDto> {
    const toilet = await this.repository.findByPublicId(publicId);
    if (!toilet) {
      throw new NotFoundException(TOILET_EXCEPTIONS.TOILET_NOT_FOUND);
    }
    const dto = await this.enrichToiletWithCommentRate.execute([toilet]);
    return dto[0];
  }
}
