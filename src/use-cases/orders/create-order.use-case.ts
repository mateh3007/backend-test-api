import { Injectable, Logger } from '@nestjs/common';
import { ShippingAdapter } from '../../domain/adapters';
import { OrderEntity } from '../../domain/entities';
import { AddressableEnum, OrderStatusEnum, UserTypeEnum } from '../../domain/enum';
import { ICreateOrderInput, ICreateOrderOutput } from '../../domain/interfaces';
import {
  AddressRepository,
  OrderRepository,
  ProductRepository,
} from '../../domain/repositories';
import { BaseUseCase } from '../base.use-case';

@Injectable()
export class CreateOrderUseCase extends BaseUseCase<
  ICreateOrderInput,
  ICreateOrderOutput
> {
  private readonly logger = new Logger(CreateOrderUseCase.name);

  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository,
    private readonly addressRepository: AddressRepository,
    private readonly shippingAdapter: ShippingAdapter,
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
    
    const sellerAddress =
      await this.addressRepository.findByAddressableIdAndType(
        product.sellerId,
        product.sellerType === UserTypeEnum.COMPANY
          ? AddressableEnum.COMPANY
          : AddressableEnum.USER,
      );

    if (!sellerAddress) {
      throw new Error('Seller address not found');
    }

    let shippingCost = 0;

    if (!product.freeShipping) {
      const shippingResult = await this.shippingAdapter.calculate({
        originZipCode: sellerAddress.zipCode,
        destinationZipCode: input.destinationZipCode,
      });
      shippingCost = shippingResult.cost;
      this.logger.log(
        `📦 Shipping calculated: R$ ${shippingCost.toFixed(2)} - From: ${sellerAddress.zipCode} To: ${input.destinationZipCode}`,
      );
    } else {
      this.logger.log(
        `🆓 Free shipping for product ${product._id}`,
      );
    }

    const totalPrice = product.price * input.productQuantity + shippingCost;

    const order = new OrderEntity({});
    order.productId = input.productId;
    order.productQuantity = input.productQuantity;
    order.shippingCost = shippingCost;
    order.totalPrice = totalPrice;
    order.status = OrderStatusEnum.PENDING;
    order.sellerId = product.sellerId;
    order.sellerType = product.sellerType;
    order.buyerId = input.buyerId;

    const createdOrder = await this.orderRepository.create(order);

    product.stock = product.stock - input.productQuantity;
    await this.productRepository.update(product);
    this.logger.log(
      `📦 Stock updated for product ${product._id}: ${product.stock + input.productQuantity} → ${product.stock}`,
    );

    return {
      id: createdOrder._id,
      productId: createdOrder.productId,
      productQuantity: createdOrder.productQuantity,
      shippingCost: createdOrder.shippingCost,
      totalPrice: createdOrder.totalPrice,
      sellerId: createdOrder.sellerId,
      sellerType: createdOrder.sellerType,
      buyerId: createdOrder.buyerId,
      createdAt: createdOrder._createdAt,
    };
  }
}
