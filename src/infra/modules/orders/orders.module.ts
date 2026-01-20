import { Module } from '@nestjs/common';
import {
  OrderRepository,
  ProductRepository,
} from '../../../domain/repositories';
import {
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

@Module({
  imports: [DatabaseModule],
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
    CreateOrderUseCase,
    UpdateOrderStatusUseCase,
  ],
  exports: [OrderRepository],
})
export class OrdersModule {}
