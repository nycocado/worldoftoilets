import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, PermissionsGuard } from '@common/guards';
import { RequiresPermissions } from '@common/decorators';
import { PermissionApiName } from '@database/entities';
import { SearchToiletsRequestDto } from '@modules/search-toilet/dto/search-toilets-request.dto';
import { ApiResponseDto } from '@common/dto/api-response.dto';
import { TOILET_MESSAGES } from '@modules/toilet/constants/messages.constant';
import { SearchToiletResponseDto } from '@modules/search-toilet/dto';
import { GetSearchToiletsByFullTextSearchUseCase } from '@modules/search-toilet/use-cases/get-search-toilets-by-full-text-search.use-case';

@Controller('search-toilet')
export class SearchToiletController {
  constructor(
    private readonly getSearchToiletsByFullTextUseCase: GetSearchToiletsByFullTextSearchUseCase,
  ) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.SEARCH_TOILETS)
  @Get('')
  async searchToilets(
    @Query() searchDto: SearchToiletsRequestDto,
  ): Promise<ApiResponseDto<SearchToiletResponseDto[]>> {
    const { query, pageable, page, size } = searchDto;

    const result = await this.getSearchToiletsByFullTextUseCase.execute(
      query,
      pageable,
      page,
      size,
    );

    return new ApiResponseDto<SearchToiletResponseDto[]>(
      TOILET_MESSAGES.SEARCH_TOILETS_SUCCESS,
      result,
    );
  }
}
