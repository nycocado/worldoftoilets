import { Injectable } from '@nestjs/common';
import { ToiletService } from '@modules/toilet';
import { plainToInstance } from 'class-transformer';
import { SearchToiletResponseDto } from '@modules/search-toilet/dto';

@Injectable()
export class GetSearchToiletsByFullTextSearchUseCase {
  constructor(private readonly toiletService: ToiletService) {}

  async execute(
    query: string,
    pageable?: boolean,
    page?: number,
    size?: number,
  ): Promise<SearchToiletResponseDto[]> {
    const toilets = await this.toiletService.getByFullTextSearch(
      query,
      pageable,
      page,
      size,
    );

    return plainToInstance(SearchToiletResponseDto, toilets, {
      excludeExtraneousValues: true,
    });
  }
}
