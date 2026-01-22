import { Injectable } from '@nestjs/common';
import { OrderStatusEnum } from '../../domain/enum';
import {
  IUpdateOrderStatusInput,
  IUpdateOrderStatusOutput,
} from '../../domain/interfaces';
import { OrderRepository, ProductRepository } from '../../domain/repositories';
import { BaseUseCase } from '../base.use-case';

@Injectable()
export class UpdateOrderStatusUseCase extends BaseUseCase<
  IUpdateOrderStatusInput,
  IUpdateOrderStatusOutput
> {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository,
  ) {
    super();
  }

  async execute(
    input: IUpdateOrderStatusInput,
  ): Promise<IUpdateOrderStatusOutput> {
    const order = await this.orderRepository.findById(input.id);

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status === OrderStatusEnum.CANCELLED) {
      throw new Error('Cannot update a cancelled order');
    }

    if (
      order.status === OrderStatusEnum.CONFIRMED &&
      input.status === OrderStatusEnum.PENDING
    ) {
      throw new Error('Cannot revert a confirmed order to pending');
    }

    // Restore stock when order is cancelled
    // O estoque já foi decrementado quando o pedido foi criado (PENDING)
    // Então precisamos restaurar se cancelar um pedido PENDING ou CONFIRMED
    if (input.status === OrderStatusEnum.CANCELLED) {
      const product = await this.productRepository.findById(order.productId);

      if (product) {
        // Restaurar o estoque (já verificamos no início que não está cancelado)
        product.stock = product.stock + order.productQuantity;
        await this.productRepository.update(product);
      }
    }

    order.status = input.status;
    const updatedOrder = await this.orderRepository.update(order);

    return {
      id: updatedOrder._id,
      status: updatedOrder.status,
      updatedAt: updatedOrder._updatedAt,
    };
  }
}
