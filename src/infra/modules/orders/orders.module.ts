import { Module } from '@nestjs/common';
import {
  OrderRepository,
  ProductRepository,
  AddressRepository,
} from '../../../domain/repositories';
import {
  OrderPrismaRepository,
  ProductPrismaRepository,
  AddressPrismaRepository,
} from '../../database/repositories';
import {
  CreateOrderController,
  UpdateOrderStatusController,
} from '../../../presentation/controllers/order';
import {
  CreateOrderUseCase,
  UpdateOrderStatusUseCase,
} from '../../../use-cases/orders';

@Module({
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
