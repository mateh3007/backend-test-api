import { OrderEntity } from './order.entity';
import { BaseEntity } from './base.entity';
import { OrderStatusEnum } from '../enum/order-status.enum';
import { UserTypeEnum } from '../enum/user.enum';

describe('OrderEntity', () => {
  describe('constructor', () => {
    it('should create an OrderEntity instance', () => {
      const order = new OrderEntity({});

      expect(order).toBeInstanceOf(OrderEntity);
    });

    it('should create an empty OrderEntity instance with undefined values', () => {
      const order = new OrderEntity({});

      expect(order.productId).toBeUndefined();
      expect(order.productQuantity).toBeUndefined();
      expect(order.shippingCost).toBeUndefined();
      expect(order.totalPrice).toBeUndefined();
      expect(order.status).toBeUndefined();
      expect(order.sellerId).toBeUndefined();
      expect(order.sellerType).toBeUndefined();
      expect(order.buyerId).toBeUndefined();
    });
  });

  describe('inheritance', () => {
    it('should be an instance of BaseEntity', () => {
      const order = new OrderEntity({});

      expect(order).toBeInstanceOf(BaseEntity);
    });

    it('should inherit BaseEntity fields', () => {
      const now = new Date();
      const orderData = {
        _id: 'order-123',
        _createdAt: now,
        _updatedAt: now,
      };

      const order = new OrderEntity(orderData);

      expect(order._id).toBe('order-123');
      expect(order._createdAt).toBe(now);
      expect(order._updatedAt).toBe(now);
    });
  });

  describe('getters and setters', () => {
    it('should set and get productId correctly', () => {
      const order = new OrderEntity({});

      order.productId = 'product-123';

      expect(order.productId).toBe('product-123');
    });

    it('should set and get productQuantity correctly', () => {
      const order = new OrderEntity({});

      order.productQuantity = 5;

      expect(order.productQuantity).toBe(5);
    });

    it('should set and get shippingCost correctly', () => {
      const order = new OrderEntity({});

      order.shippingCost = 15.99;

      expect(order.shippingCost).toBe(15.99);
    });

    it('should set and get totalPrice correctly', () => {
      const order = new OrderEntity({});

      order.totalPrice = 199.99;

      expect(order.totalPrice).toBe(199.99);
    });

    it('should set and get status correctly', () => {
      const order = new OrderEntity({});

      order.status = OrderStatusEnum.PENDING;

      expect(order.status).toBe(OrderStatusEnum.PENDING);
    });

    it('should set and get sellerId correctly', () => {
      const order = new OrderEntity({});

      order.sellerId = 'seller-123';

      expect(order.sellerId).toBe('seller-123');
    });

    it('should set and get sellerType correctly', () => {
      const order = new OrderEntity({});

      order.sellerType = UserTypeEnum.COMPANY;

      expect(order.sellerType).toBe(UserTypeEnum.COMPANY);
    });

    it('should set and get buyerId correctly', () => {
      const order = new OrderEntity({});

      order.buyerId = 'buyer-456';

      expect(order.buyerId).toBe('buyer-456');
    });
  });

  describe('order status enums', () => {
    it('should accept OrderStatusEnum.PENDING', () => {
      const order = new OrderEntity({});
      order.status = OrderStatusEnum.PENDING;

      expect(order.status).toBe(OrderStatusEnum.PENDING);
      expect(order.status).toBe('PENDING');
    });

    it('should accept OrderStatusEnum.CONFIRMED', () => {
      const order = new OrderEntity({});
      order.status = OrderStatusEnum.CONFIRMED;

      expect(order.status).toBe(OrderStatusEnum.CONFIRMED);
      expect(order.status).toBe('CONFIRMED');
    });

    it('should accept OrderStatusEnum.CANCELLED', () => {
      const order = new OrderEntity({});
      order.status = OrderStatusEnum.CANCELLED;

      expect(order.status).toBe(OrderStatusEnum.CANCELLED);
      expect(order.status).toBe('CANCELLED');
    });
  });

  describe('seller type enums', () => {
    it('should accept UserTypeEnum.COMPANY', () => {
      const order = new OrderEntity({});
      order.sellerType = UserTypeEnum.COMPANY;

      expect(order.sellerType).toBe(UserTypeEnum.COMPANY);
      expect(order.sellerType).toBe('COMPANY');
    });

    it('should accept UserTypeEnum.USER', () => {
      const order = new OrderEntity({});
      order.sellerType = UserTypeEnum.USER;

      expect(order.sellerType).toBe(UserTypeEnum.USER);
      expect(order.sellerType).toBe('USER');
    });
  });

  describe('numeric fields', () => {
    it('should handle zero shippingCost', () => {
      const order = new OrderEntity({});

      order.shippingCost = 0;

      expect(order.shippingCost).toBe(0);
    });

    it('should handle decimal totalPrice', () => {
      const order = new OrderEntity({});

      order.totalPrice = 99.99;

      expect(order.totalPrice).toBe(99.99);
    });

    it('should handle productQuantity of 1', () => {
      const order = new OrderEntity({});

      order.productQuantity = 1;

      expect(order.productQuantity).toBe(1);
    });

    it('should handle large productQuantity', () => {
      const order = new OrderEntity({});

      order.productQuantity = 1000;

      expect(order.productQuantity).toBe(1000);
    });
  });

  describe('value updates', () => {
    it('should allow updating status', () => {
      const order = new OrderEntity({});
      order.status = OrderStatusEnum.PENDING;

      order.status = OrderStatusEnum.CONFIRMED;

      expect(order.status).toBe(OrderStatusEnum.CONFIRMED);
    });

    it('should allow updating totalPrice', () => {
      const order = new OrderEntity({});
      order.totalPrice = 100;

      order.totalPrice = 150;

      expect(order.totalPrice).toBe(150);
    });

    it('should allow updating productQuantity', () => {
      const order = new OrderEntity({});
      order.productQuantity = 2;

      order.productQuantity = 5;

      expect(order.productQuantity).toBe(5);
    });

    it('should allow cancelling an order', () => {
      const order = new OrderEntity({});
      order.status = OrderStatusEnum.PENDING;

      order.status = OrderStatusEnum.CANCELLED;

      expect(order.status).toBe(OrderStatusEnum.CANCELLED);
    });
  });
});

