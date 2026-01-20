import { OrderEntity } from '../../domain/entities';
import { OrderStatusEnum } from '../../domain/enum';
import { ICreateOrderInput, ICreateOrderOutput } from '../../domain/interfaces';
import { OrderRepository, ProductRepository } from '../../domain/repositories';
import { BaseUseCase } from '../base.use-case';

export class CreateOrderUseCase extends BaseUseCase<
  ICreateOrderInput,
  ICreateOrderOutput
> {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository,
  ) {
    super();
  }

  async execute(input: ICreateOrderInput): Promise<ICreateOrderOutput> {
    const product = await this.productRepository.findById(input.productId);

    if (!product) {
      throw new Error('Product not found');
    }

    if (product.stock < input.productQuantity) {
      throw new Error('Insufficient stock');
    }

    const totalPrice =
      product.price * input.productQuantity + input.shippingCost;

    const order = new OrderEntity({});
    order.productId = input.productId;
    order.productQuantity = input.productQuantity;
    order.shippingCost = input.shippingCost;
    order.totalPrice = totalPrice;
    order.status = OrderStatusEnum.PENDING;
    order.sellerId = input.sellerId;
    order.sellerType = input.sellerType;
    order.buyerId = input.buyerId;

    const createdOrder = await this.orderRepository.create(order);

    return {
      id: createdOrder._id,
      productId: createdOrder.productId,
      productQuantity: createdOrder.productQuantity,
      shippingCost: createdOrder.shippingCost,
      sellerId: createdOrder.sellerId,
      sellerType: createdOrder.sellerType,
      buyerId: createdOrder.buyerId,
      createdAt: createdOrder._createdAt,
    };
  }
}
