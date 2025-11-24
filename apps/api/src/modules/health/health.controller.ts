import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { ApiSwaggerHealthCheck } from './swagger';

/**
 * Gerencia as requisições HTTP para operações relacionadas ao health check.
 */
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
  ) {}

  /**
   * Verifica o estado de saúde da aplicação.
   * @returns {Promise<HealthCheckResult>} O resultado do health check.
   */
  @Get()
  @HealthCheck()
  @ApiSwaggerHealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024), // 150MB
    ]);
  }
}
