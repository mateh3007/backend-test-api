import { Global, Module } from '@nestjs/common';
import { BcryptAdapter } from '../../../domain/adapters';
import { BcryptIntegration } from '../../integrations';

@Global()
@Module({
  providers: [
    {
      provide: BcryptAdapter,
      useClass: BcryptIntegration,
    },
  ],
  exports: [BcryptAdapter],
})
export class BcryptModule {}
