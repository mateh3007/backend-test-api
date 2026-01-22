import { Module } from '@nestjs/common';
import { HealthController } from '../../../presentation/controllers/health/health.controller';
import { DatabaseModule } from '../database';
import { RedisModule } from '../redis';

@Module({
  imports: [DatabaseModule, RedisModule],
  controllers: [HealthController],
})
export class HealthModule {}

