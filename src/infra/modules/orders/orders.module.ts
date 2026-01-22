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
  GetOrderByIdController,
  ListOrdersController,
  UpdateOrderStatusController,
} from '../../../presentation/controllers/order';
import {
  CreateOrderUseCase,
  GetOrderByIdUseCase,
  ListOrdersUseCase,
  UpdateOrderStatusUseCase,
} from '../../../use-cases/orders';
import { DatabaseModule } from '../database';
import { AddressesModule } from '../addresses';
import { ShippingModule } from '../shipping';

@Module({
  imports: [DatabaseModule, AddressesModule, ShippingModule],
  controllers: [
    CreateOrderController,
    GetOrderByIdController,
    ListOrdersController,
    UpdateOrderStatusController,
  ],
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
    GetOrderByIdUseCase,
    ListOrdersUseCase,
    UpdateOrderStatusUseCase,
  ],
  exports: [OrderRepository],
})
export class OrdersModule {}
