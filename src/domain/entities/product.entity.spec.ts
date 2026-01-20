import { ProductEntity } from './product.entity';
import { BaseEntity } from './base.entity';
import { CategoryEnum } from '../enum/category.enum';

describe('ProductEntity', () => {
  describe('constructor', () => {
    it('should create a ProductEntity instance', () => {
      const product = new ProductEntity({});

      expect(product).toBeInstanceOf(ProductEntity);
    });

    it('should create an empty ProductEntity instance with undefined values', () => {
      const product = new ProductEntity({});

      expect(product.name).toBeUndefined();
      expect(product.category).toBeUndefined();
      expect(product.description).toBeUndefined();
      expect(product.price).toBeUndefined();
      expect(product.stock).toBeUndefined();
      expect(product.freeShipping).toBeUndefined();
    });
  });

  describe('inheritance', () => {
    it('should be an instance of BaseEntity', () => {
      const product = new ProductEntity({});

      expect(product).toBeInstanceOf(BaseEntity);
    });

    it('should inherit BaseEntity fields', () => {
      const now = new Date();
      const productData = {
        _id: 'product-123',
        _createdAt: now,
        _updatedAt: now,
      };

      const product = new ProductEntity(productData);

      expect(product._id).toBe('product-123');
      expect(product._createdAt).toBe(now);
      expect(product._updatedAt).toBe(now);
    });
  });

  describe('getters and setters', () => {
    it('should set and get name correctly', () => {
      const product = new ProductEntity({});

      product.name = 'iPhone 15';

      expect(product.name).toBe('iPhone 15');
    });

    it('should set and get category correctly', () => {
      const product = new ProductEntity({});

      product.category = CategoryEnum.ELECTRONICS;

      expect(product.category).toBe(CategoryEnum.ELECTRONICS);
    });

    it('should set and get description correctly', () => {
      const product = new ProductEntity({});

      product.description = 'Latest Apple smartphone';

      expect(product.description).toBe('Latest Apple smartphone');
    });

    it('should set and get price correctly', () => {
      const product = new ProductEntity({});

      product.price = 999.99;

      expect(product.price).toBe(999.99);
    });

    it('should set and get stock correctly', () => {
      const product = new ProductEntity({});

      product.stock = 100;

      expect(product.stock).toBe(100);
    });

    it('should set and get freeShipping correctly', () => {
      const product = new ProductEntity({});

      product.freeShipping = true;

      expect(product.freeShipping).toBe(true);
    });
  });

  describe('enums', () => {
    it('should accept CategoryEnum.ELECTRONICS', () => {
      const product = new ProductEntity({});
      product.category = CategoryEnum.ELECTRONICS;

      expect(product.category).toBe(CategoryEnum.ELECTRONICS);
      expect(product.category).toBe('ELECTRONICS');
    });

    it('should accept CategoryEnum.CLOTHING', () => {
      const product = new ProductEntity({});
      product.category = CategoryEnum.CLOTHING;

      expect(product.category).toBe(CategoryEnum.CLOTHING);
      expect(product.category).toBe('CLOTHING');
    });

    it('should accept CategoryEnum.HOME', () => {
      const product = new ProductEntity({});
      product.category = CategoryEnum.HOME;

      expect(product.category).toBe(CategoryEnum.HOME);
      expect(product.category).toBe('HOME');
    });

    it('should accept CategoryEnum.BEAUTY', () => {
      const product = new ProductEntity({});
      product.category = CategoryEnum.BEAUTY;

      expect(product.category).toBe(CategoryEnum.BEAUTY);
      expect(product.category).toBe('BEAUTY');
    });

    it('should accept CategoryEnum.SPORTS', () => {
      const product = new ProductEntity({});
      product.category = CategoryEnum.SPORTS;

      expect(product.category).toBe(CategoryEnum.SPORTS);
      expect(product.category).toBe('SPORTS');
    });

    it('should accept CategoryEnum.TOOLS', () => {
      const product = new ProductEntity({});
      product.category = CategoryEnum.TOOLS;

      expect(product.category).toBe(CategoryEnum.TOOLS);
      expect(product.category).toBe('TOOLS');
    });

    it('should accept CategoryEnum.OTHER', () => {
      const product = new ProductEntity({});
      product.category = CategoryEnum.OTHER;

      expect(product.category).toBe(CategoryEnum.OTHER);
      expect(product.category).toBe('OTHER');
    });
  });

  describe('boolean fields', () => {
    it('should set freeShipping to true', () => {
      const product = new ProductEntity({});

      product.freeShipping = true;

      expect(product.freeShipping).toBe(true);
    });

    it('should set freeShipping to false', () => {
      const product = new ProductEntity({});

      product.freeShipping = false;

      expect(product.freeShipping).toBe(false);
    });
  });

  describe('numeric fields', () => {
    it('should handle zero price', () => {
      const product = new ProductEntity({});

      product.price = 0;

      expect(product.price).toBe(0);
    });

    it('should handle zero stock', () => {
      const product = new ProductEntity({});

      product.stock = 0;

      expect(product.stock).toBe(0);
    });

    it('should handle decimal price', () => {
      const product = new ProductEntity({});

      product.price = 49.99;

      expect(product.price).toBe(49.99);
    });
  });

  describe('value updates', () => {
    it('should allow updating price', () => {
      const product = new ProductEntity({});
      product.price = 100;

      product.price = 150;

      expect(product.price).toBe(150);
    });

    it('should allow updating stock', () => {
      const product = new ProductEntity({});
      product.stock = 50;

      product.stock = 30;

      expect(product.stock).toBe(30);
    });

    it('should allow updating category', () => {
      const product = new ProductEntity({});
      product.category = CategoryEnum.ELECTRONICS;

      product.category = CategoryEnum.HOME;

      expect(product.category).toBe(CategoryEnum.HOME);
    });
  });
});

