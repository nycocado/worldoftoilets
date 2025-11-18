import { Injectable } from '@nestjs/common';
import { ToiletService } from '@modules/toilet';
import { plainToInstance } from 'class-transformer';
import { SearchToiletResponseDto } from '@modules/search-toilet/dto';
import { ToiletStatus } from '@database/entities';

@Injectable()
export class GetSearchToiletsByFullTextSearchUseCase {
  constructor(private readonly toiletService: ToiletService) {}

  async execute(
    query: string,
    pageable?: boolean,
    page?: number,
    size?: number,
  ): Promise<SearchToiletResponseDto[]> {
    const toilets = await this.toiletService.getToiletsByFullTextSearch(
      query,
      pageable,
      page,
      size,
      ToiletStatus.ACTIVE,
    );

    return plainToInstance(SearchToiletResponseDto, toilets, {
      excludeExtraneousValues: true,
    });
  }
}
