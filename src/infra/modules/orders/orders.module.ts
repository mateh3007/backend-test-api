import { Module } from '@nestjs/common';
import {
  AddressRepository,
  OrderRepository,
  ProductRepository,
} from '../../../domain/repositories';
import {
  AddressPrismaRepository,
  OrderPrismaRepository,
  ProductPrismaRepository,
} from '../../database/repositories';
import {
  CreateOrderController,
  UpdateOrderStatusController,
} from '../../../presentation/controllers/order';
import {
  CreateOrderUseCase,
  UpdateOrderStatusUseCase,
} from '../../../use-cases/orders';
import { DatabaseModule } from '../database';
import { AddressesModule } from '../addresses';
import { ShippingModule } from '../shipping';

@Module({
  imports: [DatabaseModule, AddressesModule, ShippingModule],
  controllers: [CreateOrderController, UpdateOrderStatusController],
  providers: [
    {
      provide: OrderRepository,
      useClass: OrderPrismaRepository,
    },
    {
      provide: ProductRepository,
      useClass: ProductPrismaRepository,
    },
    {
      provide: AddressRepository,
      useClass: AddressPrismaRepository,
    },
    CreateOrderUseCase,
    UpdateOrderStatusUseCase,
  ],
  exports: [OrderRepository],
})
export class OrdersModule {}
