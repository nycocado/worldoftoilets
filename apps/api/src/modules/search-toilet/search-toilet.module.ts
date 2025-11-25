import { Module } from '@nestjs/common';
import { SearchToiletController } from './search-toilet.controller';
import { ToiletModule } from '@modules/toilet';
import { UserModule } from '@modules/user';
import { GetSearchToiletsByFullTextSearchUseCase } from '@modules/search-toilet/use-cases/get-search-toilets-by-full-text-search.use-case';

/**
 * Gerencia a funcionalidade de pesquisa de casas de banho, agrupando seus componentes.
 */
@Module({
  imports: [ToiletModule, UserModule],
  controllers: [SearchToiletController],
  providers: [GetSearchToiletsByFullTextSearchUseCase],
})
export class SearchToiletModule {}
