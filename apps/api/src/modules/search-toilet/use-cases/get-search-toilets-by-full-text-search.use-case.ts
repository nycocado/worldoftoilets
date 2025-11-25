import { Injectable } from '@nestjs/common';
import { ToiletService } from '@modules/toilet';
import { plainToInstance } from 'class-transformer';
import { SearchToiletResponseDto } from '@modules/search-toilet/dto';
import { ToiletStatus } from '@database/entities';
import { UserService } from '@modules/user/user.service';

@Injectable()
export class GetSearchToiletsByFullTextSearchUseCase {
  constructor(
    private readonly toiletService: ToiletService,
    private readonly userService: UserService,
  ) {}

  async execute(
    query: string,
    pageable?: boolean,
    page?: number,
    size?: number,
    userPublicId?: string,
  ): Promise<SearchToiletResponseDto[]> {
    const user = userPublicId
      ? await this.userService.getUserByPublicId(userPublicId)
      : undefined;

    const toilets = await this.toiletService.getToiletsByFullTextSearch(
      query,
      pageable,
      page,
      size,
      ToiletStatus.ACTIVE,
      user,
    );

    return plainToInstance(SearchToiletResponseDto, toilets, {
      excludeExtraneousValues: true,
    });
  }
}
