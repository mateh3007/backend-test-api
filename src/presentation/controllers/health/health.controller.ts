import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { CacheAdapter } from '../../../domain/adapters';

interface IHealthCheck {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  database: {
    status: 'connected' | 'disconnected';
    responseTime?: number;
  };
  cache: {
    status: 'connected' | 'disconnected';
    responseTime?: number;
  };
  memory: {
    used: string;
    total: string;
    percentage: number;
  };
}

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CacheAdapter) private readonly cacheAdapter: CacheAdapter,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Health check',
    description: 'Verifica o status da aplicação e suas dependências',
  })
  @ApiResponse({
    status: 200,
    description: 'Aplicação saudável',
  })
  async check(): Promise<IHealthCheck> {
    const uptime = process.uptime();

    let dbStatus: 'connected' | 'disconnected' = 'disconnected';
    let dbResponseTime: number | undefined;
    try {
      const dbStart = Date.now();
      await this.prisma.$queryRaw`SELECT 1`;
      dbResponseTime = Date.now() - dbStart;
      dbStatus = 'connected';
    } catch (error) {
      dbStatus = 'disconnected';
    }

    let cacheStatus: 'connected' | 'disconnected' = 'disconnected';
    let cacheResponseTime: number | undefined;
    try {
      const cacheStart = Date.now();
      await this.cacheAdapter.get('health:check');
      cacheResponseTime = Date.now() - cacheStart;
      cacheStatus = 'connected';
    } catch (error) {
      cacheStatus = 'disconnected';
    }

    const memoryUsage = process.memoryUsage();
    const usedMB = (memoryUsage.heapUsed / 1024 / 1024).toFixed(2);
    const totalMB = (memoryUsage.heapTotal / 1024 / 1024).toFixed(2);
    const percentage = Number(
      ((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100).toFixed(2),
    );

    const overallStatus =
      dbStatus === 'connected' && cacheStatus === 'connected'
        ? 'ok'
        : 'error';

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: Math.floor(uptime),
      database: {
        status: dbStatus,
        responseTime: dbResponseTime,
      },
      cache: {
        status: cacheStatus,
        responseTime: cacheResponseTime,
      },
      memory: {
        used: `${usedMB} MB`,
        total: `${totalMB} MB`,
        percentage,
      },
    };
  }
}

