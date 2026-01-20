import { CreateOrderUseCase } from './create-order.use-case';
import { OrderRepository, ProductRepository } from '../../domain/repositories';
import { OrderEntity, ProductEntity } from '../../domain/entities';
import { CategoryEnum, OrderStatusEnum, UserTypeEnum } from '../../domain/enum';
import { ICreateOrderInput } from '../../domain/interfaces';

describe('CreateOrderUseCase', () => {
  let useCase: CreateOrderUseCase;
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

  const mockOrderEntity = (): OrderEntity => {
    const order = new OrderEntity({});
    order._id = 'order-123';
    order.productId = 'product-123';
    order.productQuantity = 2;
    order.shippingCost = 10;
    order.totalPrice = 210;
    order.status = OrderStatusEnum.PENDING;
    order.sellerId = 'seller-123';
    order.sellerType = UserTypeEnum.COMPANY;
    order.buyerId = 'buyer-456';
    order._createdAt = new Date('2026-01-01');
    order._updatedAt = new Date('2026-01-01');
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

    useCase = new CreateOrderUseCase(orderRepository, productRepository);
  });

  describe('execute', () => {
    it('should create an order successfully', async () => {
      const input: ICreateOrderInput = {
        productId: 'product-123',
        productQuantity: 2,
        shippingCost: 10,
        sellerId: 'seller-123',
        sellerType: UserTypeEnum.COMPANY,
        buyerId: 'buyer-456',
      };

      const product = mockProductEntity();
      const createdOrder = mockOrderEntity();

      productRepository.findById.mockResolvedValue(product);
      orderRepository.create.mockResolvedValue(createdOrder);

      const result = await useCase.execute(input);

      expect(productRepository.findById).toHaveBeenCalledWith('product-123');
      expect(orderRepository.create).toHaveBeenCalled();
      expect(result.id).toBe('order-123');
      expect(result.productId).toBe(input.productId);
      expect(result.productQuantity).toBe(input.productQuantity);
      expect(result.shippingCost).toBe(input.shippingCost);
    });

    it('should throw error if product not found', async () => {
      const input: ICreateOrderInput = {
        productId: 'non-existent',
        productQuantity: 2,
        shippingCost: 10,
        sellerId: 'seller-123',
        sellerType: UserTypeEnum.COMPANY,
        buyerId: 'buyer-456',
      };

      productRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(input)).rejects.toThrow('Product not found');
      expect(orderRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error if insufficient stock', async () => {
      const input: ICreateOrderInput = {
        productId: 'product-123',
        productQuantity: 100,
        shippingCost: 10,
        sellerId: 'seller-123',
        sellerType: UserTypeEnum.COMPANY,
        buyerId: 'buyer-456',
      };

      const product = mockProductEntity();
      product.stock = 5;

      productRepository.findById.mockResolvedValue(product);

      await expect(useCase.execute(input)).rejects.toThrow('Insufficient stock');
      expect(orderRepository.create).not.toHaveBeenCalled();
    });

    it('should calculate totalPrice correctly', async () => {
      const input: ICreateOrderInput = {
        productId: 'product-123',
        productQuantity: 3,
        shippingCost: 15,
        sellerId: 'seller-123',
        sellerType: UserTypeEnum.COMPANY,
        buyerId: 'buyer-456',
      };

      const product = mockProductEntity();
      product.price = 100;

      const expectedTotalPrice = (100 * 3) + 15; // 315

      productRepository.findById.mockResolvedValue(product);
      orderRepository.create.mockImplementation(async (order) => {
        expect(order.totalPrice).toBe(expectedTotalPrice);
        return order;
      });

      await useCase.execute(input);

      expect(orderRepository.create).toHaveBeenCalled();
    });

    it('should set order status to PENDING', async () => {
      const input: ICreateOrderInput = {
        productId: 'product-123',
        productQuantity: 1,
        shippingCost: 0,
        sellerId: 'seller-123',
        sellerType: UserTypeEnum.COMPANY,
        buyerId: 'buyer-456',
      };

      const product = mockProductEntity();

      productRepository.findById.mockResolvedValue(product);
      orderRepository.create.mockImplementation(async (order) => {
        expect(order.status).toBe(OrderStatusEnum.PENDING);
        return order;
      });

      await useCase.execute(input);

      expect(orderRepository.create).toHaveBeenCalled();
    });
  });
});
