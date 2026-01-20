import { Global, Module } from '@nestjs/common';
import { CacheAdapter } from '../../../domain/adapters';
import { RedisIntegration } from '../../integrations';

@Global()
@Module({
  providers: [
    {
      provide: CacheAdapter,
      useClass: RedisIntegration,
    },
  ],
  exports: [CacheAdapter],
})
export class RedisModule {}
