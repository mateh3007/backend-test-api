import { UpdateOrderStatusUseCase } from './update-order-status.use-case';
import { OrderRepository, ProductRepository } from '../../domain/repositories';
import { OrderEntity, ProductEntity } from '../../domain/entities';
import { CategoryEnum, OrderStatusEnum, UserTypeEnum } from '../../domain/enum';
import { IUpdateOrderStatusInput } from '../../domain/interfaces';

describe('UpdateOrderStatusUseCase', () => {
  let useCase: UpdateOrderStatusUseCase;
  let orderRepository: jest.Mocked<OrderRepository>;
  let productRepository: jest.Mocked<ProductRepository>;

  const mockProductEntity = (): ProductEntity => {
    const product = new ProductEntity({});
    product._id = 'product-123';
    product.name = 'iPhone 15';
    product.category = CategoryEnum.ELECTRONICS;
    product.description = 'Latest Apple smartphone';
    product.price = 100;
    product.stock = 10;
    product.freeShipping = true;
    product.sellerId = 'seller-123';
    product.sellerType = UserTypeEnum.COMPANY;
    product._createdAt = new Date('2026-01-01');
    product._updatedAt = new Date('2026-01-01');
    return product;
  };

  const mockOrderEntity = (
    status: OrderStatusEnum = OrderStatusEnum.PENDING,
  ): OrderEntity => {
    const order = new OrderEntity({});
    order._id = 'order-123';
    order.productId = 'product-123';
    order.productQuantity = 2;
    order.shippingCost = 10;
    order.totalPrice = 210;
    order.status = status;
    order.sellerId = 'seller-123';
    order.sellerType = UserTypeEnum.COMPANY;
    order.buyerId = 'buyer-456';
    order._createdAt = new Date('2026-01-01');
    order._updatedAt = new Date('2026-01-02');
    return order;
  };

  beforeEach(() => {
    orderRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByFilter: jest.fn(),
    } as jest.Mocked<OrderRepository>;

    productRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByFilter: jest.fn(),
    } as jest.Mocked<ProductRepository>;

    useCase = new UpdateOrderStatusUseCase(orderRepository, productRepository);
  });

  describe('execute', () => {
    it('should update order status to CONFIRMED', async () => {
      const input: IUpdateOrderStatusInput = {
        id: 'order-123',
        status: OrderStatusEnum.CONFIRMED,
      };

      const order = mockOrderEntity(OrderStatusEnum.PENDING);
      const updatedOrder = mockOrderEntity(OrderStatusEnum.CONFIRMED);

      orderRepository.findById.mockResolvedValue(order);
      orderRepository.update.mockResolvedValue(updatedOrder);

      const result = await useCase.execute(input);

      expect(result.status).toBe(OrderStatusEnum.CONFIRMED);
      expect(productRepository.update).not.toHaveBeenCalled();
    });

    it('should throw error if order not found', async () => {
      const input: IUpdateOrderStatusInput = {
        id: 'non-existent',
        status: OrderStatusEnum.CONFIRMED,
      };

      orderRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(input)).rejects.toThrow('Order not found');
    });

    it('should throw error if trying to update cancelled order', async () => {
      const input: IUpdateOrderStatusInput = {
        id: 'order-123',
        status: OrderStatusEnum.CONFIRMED,
      };

      const order = mockOrderEntity(OrderStatusEnum.CANCELLED);

      orderRepository.findById.mockResolvedValue(order);

      await expect(useCase.execute(input)).rejects.toThrow(
        'Cannot update a cancelled order',
      );
    });

    it('should throw error if trying to revert confirmed to pending', async () => {
      const input: IUpdateOrderStatusInput = {
        id: 'order-123',
        status: OrderStatusEnum.PENDING,
      };

      const order = mockOrderEntity(OrderStatusEnum.CONFIRMED);

      orderRepository.findById.mockResolvedValue(order);

      await expect(useCase.execute(input)).rejects.toThrow(
        'Cannot revert a confirmed order to pending',
      );
    });

    it('should not decrement stock when confirming order (already decremented on creation)', async () => {
      const input: IUpdateOrderStatusInput = {
        id: 'order-123',
        status: OrderStatusEnum.CONFIRMED,
      };

      const order = mockOrderEntity(OrderStatusEnum.PENDING);
      const updatedOrder = mockOrderEntity(OrderStatusEnum.CONFIRMED);

      orderRepository.findById.mockResolvedValue(order);
      orderRepository.update.mockResolvedValue(updatedOrder);

      await useCase.execute(input);

      expect(productRepository.update).not.toHaveBeenCalled();
    });

    it('should update order status to CONFIRMED without checking stock', async () => {
      const input: IUpdateOrderStatusInput = {
        id: 'order-123',
        status: OrderStatusEnum.CONFIRMED,
      };

      const order = mockOrderEntity(OrderStatusEnum.PENDING);
      const updatedOrder = mockOrderEntity(OrderStatusEnum.CONFIRMED);

      orderRepository.findById.mockResolvedValue(order);
      orderRepository.update.mockResolvedValue(updatedOrder);

      const result = await useCase.execute(input);

      expect(result.status).toBe(OrderStatusEnum.CONFIRMED);
      expect(productRepository.findById).not.toHaveBeenCalled();
    });

    it('should restore stock when cancelling confirmed order', async () => {
      const input: IUpdateOrderStatusInput = {
        id: 'order-123',
        status: OrderStatusEnum.CANCELLED,
      };

      const order = mockOrderEntity(OrderStatusEnum.CONFIRMED);
      order.productQuantity = 3;

      const product = mockProductEntity();
      product.stock = 7;

      const updatedOrder = mockOrderEntity(OrderStatusEnum.CANCELLED);

      orderRepository.findById.mockResolvedValue(order);
      productRepository.findById.mockResolvedValue(product);
      productRepository.update.mockImplementation(async (p) => {
        expect(p.stock).toBe(10); // 7 + 3
        return p;
      });
      orderRepository.update.mockResolvedValue(updatedOrder);

      const result = await useCase.execute(input);

      expect(result.status).toBe(OrderStatusEnum.CANCELLED);
      expect(productRepository.update).toHaveBeenCalled();
    });

    it('should cancel pending order without restoring stock', async () => {
      const input: IUpdateOrderStatusInput = {
        id: 'order-123',
        status: OrderStatusEnum.CANCELLED,
      };

      const order = mockOrderEntity(OrderStatusEnum.PENDING);
      const updatedOrder = mockOrderEntity(OrderStatusEnum.CANCELLED);

      orderRepository.findById.mockResolvedValue(order);
      orderRepository.update.mockResolvedValue(updatedOrder);

      const result = await useCase.execute(input);

      expect(result.status).toBe(OrderStatusEnum.CANCELLED);
      expect(productRepository.update).not.toHaveBeenCalled();
    });

    it('should update order status to CONFIRMED successfully', async () => {
      const input: IUpdateOrderStatusInput = {
        id: 'order-123',
        status: OrderStatusEnum.CONFIRMED,
      };

      const order = mockOrderEntity(OrderStatusEnum.PENDING);
      const updatedOrder = mockOrderEntity(OrderStatusEnum.CONFIRMED);

      orderRepository.findById.mockResolvedValue(order);
      orderRepository.update.mockResolvedValue(updatedOrder);

      const result = await useCase.execute(input);

      expect(result.status).toBe(OrderStatusEnum.CONFIRMED);
    });
  });
});
