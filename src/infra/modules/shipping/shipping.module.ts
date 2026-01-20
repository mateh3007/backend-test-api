import { Module } from '@nestjs/common';
import { ShippingAdapter } from '../../../domain/adapters';
import { ShippingIntegration } from '../../integrations';

@Module({
  providers: [
    {
      provide: ShippingAdapter,
      useClass: ShippingIntegration,
    },
  ],
  exports: [ShippingAdapter],
})
export class ShippingModule {}
