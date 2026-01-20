import { CreateProductUseCase } from './create-product.use-case';
import { CacheAdapter } from '../../domain/adapters';
import { ProductRepository } from '../../domain/repositories';
import { ProductEntity } from '../../domain/entities';
import { CategoryEnum, UserTypeEnum } from '../../domain/enum';
import { ICreateProductInput } from '../../domain/interfaces';

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;
  let productRepository: jest.Mocked<ProductRepository>;
  let cacheAdapter: jest.Mocked<CacheAdapter>;

  const mockProductEntity = (): ProductEntity => {
    const product = new ProductEntity({});
    product._id = 'product-123';
    product.name = 'iPhone 15';
    product.category = CategoryEnum.ELECTRONICS;
    product.description = 'Latest Apple smartphone';
    product.price = 999.99;
    product.stock = 100;
    product.freeShipping = true;
    product.sellerId = 'seller-123';
    product.sellerType = UserTypeEnum.COMPANY;
    product._createdAt = new Date('2026-01-01');
    product._updatedAt = new Date('2026-01-01');
    return product;
  };

  beforeEach(() => {
    productRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByFilter: jest.fn(),
    } as jest.Mocked<ProductRepository>;

    cacheAdapter = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
      deleteByPattern: jest.fn(),
    } as jest.Mocked<CacheAdapter>;

    useCase = new CreateProductUseCase(productRepository, cacheAdapter);
  });

  describe('execute', () => {
    it('should create a product successfully and invalidate cache', async () => {
      const input: ICreateProductInput = {
        name: 'iPhone 15',
        category: CategoryEnum.ELECTRONICS,
        description: 'Latest Apple smartphone',
        price: 999.99,
        stock: 100,
        freeShipping: true,
        sellerId: 'seller-123',
        sellerType: UserTypeEnum.COMPANY,
      };

      const createdProduct = mockProductEntity();
      productRepository.create.mockResolvedValue(createdProduct);

      const result = await useCase.execute(input);

      expect(productRepository.create).toHaveBeenCalled();
      expect(cacheAdapter.deleteByPattern).toHaveBeenCalledWith('products:list:*');
      expect(result.id).toBe('product-123');
      expect(result.name).toBe(input.name);
      expect(result.category).toBe(input.category);
      expect(result.price).toBe(input.price);
      expect(result.stock).toBe(input.stock);
      expect(result.freeShipping).toBe(input.freeShipping);
      expect(result.sellerId).toBe(input.sellerId);
      expect(result.sellerType).toBe(input.sellerType);
      expect(result.createdAt).toEqual(createdProduct._createdAt);
    });

    it('should create a product with USER as sellerType', async () => {
      const input: ICreateProductInput = {
        name: 'Used Book',
        category: CategoryEnum.OTHER,
        description: 'A used book in good condition',
        price: 29.99,
        stock: 1,
        freeShipping: false,
        sellerId: 'user-456',
        sellerType: UserTypeEnum.USER,
      };

      const createdProduct = mockProductEntity();
      createdProduct.sellerType = UserTypeEnum.USER;
      createdProduct.sellerId = 'user-456';

      productRepository.create.mockResolvedValue(createdProduct);

      const result = await useCase.execute(input);

      expect(result.sellerType).toBe(UserTypeEnum.USER);
      expect(result.sellerId).toBe('user-456');
    });

    it('should create a product with zero stock', async () => {
      const input: ICreateProductInput = {
        name: 'Out of Stock Item',
        category: CategoryEnum.CLOTHING,
        description: 'Currently unavailable',
        price: 49.99,
        stock: 0,
        freeShipping: false,
        sellerId: 'seller-123',
        sellerType: UserTypeEnum.COMPANY,
      };

      const createdProduct = mockProductEntity();
      createdProduct.stock = 0;

      productRepository.create.mockResolvedValue(createdProduct);

      const result = await useCase.execute(input);

      expect(result.stock).toBe(0);
    });
  });
});
