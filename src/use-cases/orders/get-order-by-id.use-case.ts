import { Injectable, Logger } from '@nestjs/common';
import { IOrderOutput } from '../../domain/interfaces';
import { OrderRepository } from '../../domain/repositories';
import { BaseUseCase } from '../base.use-case';

export interface IGetOrderByIdInput {
  id: string;
}

export interface IGetOrderByIdOutput extends IOrderOutput {}

@Injectable()
export class GetOrderByIdUseCase extends BaseUseCase<
  IGetOrderByIdInput,
  IGetOrderByIdOutput
> {
  private readonly logger = new Logger(GetOrderByIdUseCase.name);

  constructor(private readonly orderRepository: OrderRepository) {
    super();
  }

  async execute(input: IGetOrderByIdInput): Promise<IGetOrderByIdOutput> {
    const order = await this.orderRepository.findById(input.id);

    if (!order) {
      throw new Error('Order not found');
    }

    this.logger.log(`📋 Found order: ${order._id}`);

    return {
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
    };
  }
}


