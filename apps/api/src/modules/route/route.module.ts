import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RouteController } from './route.controller';
import { RouteService } from './route.service';
import {
  CalculateRouteUseCase,
  CalculateRouteToToiletUseCase,
} from './use-cases';
import { ToiletModule } from '@modules/toilet';
import { UserModule } from '@modules/user';

/**
 * Gerencia a funcionalidade de cálculo de rotas, agrupando seus componentes.
 */
@Module({
  imports: [HttpModule, UserModule, ToiletModule],
  controllers: [RouteController],
  providers: [
    RouteService,
    CalculateRouteUseCase,
    CalculateRouteToToiletUseCase,
  ],
  exports: [RouteService],
})
export class RouteModule {}
