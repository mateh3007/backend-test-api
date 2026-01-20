import { Module } from '@nestjs/common';
import { BcryptAdapter } from '../../../domain/adapters';
import { BcryptIntegration } from 'src/infra/integrations';

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
