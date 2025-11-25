import { Injectable } from '@nestjs/common';
import { ToiletService } from '@modules/toilet';
import { plainToInstance } from 'class-transformer';
import { SearchToiletResponseDto } from '@modules/search-toilet/dto';
import { ToiletStatus } from '@database/entities';
import { UserService } from '@modules/user/user.service';

/**
 * Contém a lógica de negócio para a pesquisa de casas de banho por texto.
 */
@Injectable()
export class GetSearchToiletsByFullTextSearchUseCase {
  constructor(
    private readonly toiletService: ToiletService,
    private readonly userService: UserService,
  ) {}

  /**
   * Executa a pesquisa full-text por casas de banho.
   *
   * @param {string} query O termo de pesquisa.
   * @param {boolean} [pageable] Define se a paginação deve ser aplicada.
   * @param {number} [page] O número da página.
   * @param {number} [size] O tamanho da página.
   * @param {string} [userPublicId] O ID público do utilizador para filtrar resultados.
   * @returns {Promise<SearchToiletResponseDto[]>} A lista de casas de banho encontradas.
   */
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
