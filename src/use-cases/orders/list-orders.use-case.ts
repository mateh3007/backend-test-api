import { Injectable, Logger } from '@nestjs/common';
import {
  IListOrdersInput,
  IListOrdersOutput,
} from '../../domain/interfaces';
import { OrderRepository } from '../../domain/repositories';
import { BaseUseCase } from '../base.use-case';

@Injectable()
export class ListOrdersUseCase extends BaseUseCase<
  IListOrdersInput,
  IListOrdersOutput
> {
  private readonly logger = new Logger(ListOrdersUseCase.name);

  constructor(private readonly orderRepository: OrderRepository) {
    super();
  }

  async execute(input: IListOrdersInput): Promise<IListOrdersOutput> {
    const filter = {
      status: input.status,
      buyerId: input.buyerId,
      sellerId: input.sellerId,
      sellerType: input.sellerType,
      limit: input.limit,
      offset: input.offset,
    };

    const [orders, total] = await Promise.all([
      this.orderRepository.findByFilter(filter),
      this.orderRepository.countByFilter(filter),
    ]);

    this.logger.log(`📋 Found ${orders.length} orders (total: ${total})`);

    const result: IListOrdersOutput = {
      orders: orders.map((order) => ({
        id: order._id,
        productId: order.productId,
        productQuantity: order.productQuantity,
        shippingCost: order.shippingCost,
        totalPrice: order.totalPrice,
        status: order.status,
        sellerId: order.sellerId,
        sellerType: order.sellerType,
        buyerId: order.buyerId,
        createdAt: order._createdAt,
        updatedAt: order._updatedAt,
      })),
      total,
    };

    return result;
  }
}

