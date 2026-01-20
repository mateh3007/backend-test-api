import { ListProductsUseCase } from './list-products.use-case';
import { CacheAdapter } from '../../domain/adapters';
import { ProductRepository } from '../../domain/repositories';
import { ProductEntity } from '../../domain/entities';
import { CategoryEnum, UserTypeEnum } from '../../domain/enum';
import {
  IListProductsInput,
  IListProductsOutput,
} from '../../domain/interfaces';

describe('ListProductsUseCase', () => {
  let useCase: ListProductsUseCase;
  let productRepository: jest.Mocked<ProductRepository>;
  let cacheAdapter: jest.Mocked<CacheAdapter>;

  const mockProductEntity = (
    overrides?: Partial<ProductEntity>,
  ): ProductEntity => {
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
    Object.assign(product, overrides);
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

    useCase = new ListProductsUseCase(productRepository, cacheAdapter);
  });

  describe('execute', () => {
    it('should list all products and cache result', async () => {
      const input: IListProductsInput = {};

      const products = [
        mockProductEntity(),
        mockProductEntity({ _id: 'product-456', name: 'Samsung Galaxy' }),
      ];

      cacheAdapter.get.mockResolvedValue(null);
      productRepository.findByFilter.mockResolvedValue(products);

      const result = await useCase.execute(input);

      expect(cacheAdapter.get).toHaveBeenCalled();
      expect(productRepository.findByFilter).toHaveBeenCalled();
      expect(cacheAdapter.set).toHaveBeenCalled();
      expect(result.products).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it('should return cached result when available', async () => {
      const input: IListProductsInput = {};

      const cachedResult: IListProductsOutput = {
        products: [
          {
            id: 'product-123',
            name: 'iPhone 15',
            category: CategoryEnum.ELECTRONICS,
            description: 'Latest Apple smartphone',
            price: 999.99,
            stock: 100,
            freeShipping: true,
            sellerId: 'seller-123',
            sellerType: UserTypeEnum.COMPANY,
            createdAt: new Date('2026-01-01'),
            updatedAt: new Date('2026-01-01'),
          },
        ],
        total: 1,
      };

      cacheAdapter.get.mockResolvedValue(cachedResult);

      const result = await useCase.execute(input);

      expect(cacheAdapter.get).toHaveBeenCalled();
      expect(productRepository.findByFilter).not.toHaveBeenCalled();
      expect(cacheAdapter.set).not.toHaveBeenCalled();
      expect(result.products).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it('should filter products by category', async () => {
      const input: IListProductsInput = {
        category: CategoryEnum.ELECTRONICS,
      };

      const products = [mockProductEntity()];

      cacheAdapter.get.mockResolvedValue(null);
      productRepository.findByFilter.mockResolvedValue(products);

      const result = await useCase.execute(input);

      expect(productRepository.findByFilter).toHaveBeenCalledWith(
        expect.objectContaining({ category: CategoryEnum.ELECTRONICS }),
      );
      expect(result.products).toHaveLength(1);
    });

    it('should filter products by sellerId', async () => {
      const input: IListProductsInput = {
        sellerId: 'seller-123',
        sellerType: UserTypeEnum.COMPANY,
      };

      const products = [mockProductEntity()];

      cacheAdapter.get.mockResolvedValue(null);
      productRepository.findByFilter.mockResolvedValue(products);

      const result = await useCase.execute(input);

      expect(productRepository.findByFilter).toHaveBeenCalledWith(
        expect.objectContaining({
          sellerId: 'seller-123',
          sellerType: UserTypeEnum.COMPANY,
        }),
      );
      expect(result.products).toHaveLength(1);
    });

    it('should filter products by price range', async () => {
      const input: IListProductsInput = {
        priceMin: 500,
        priceMax: 1500,
      };

      const products = [mockProductEntity()];

      cacheAdapter.get.mockResolvedValue(null);
      productRepository.findByFilter.mockResolvedValue(products);

      const result = await useCase.execute(input);

      expect(productRepository.findByFilter).toHaveBeenCalledWith(
        expect.objectContaining({
          price: { min: 500, max: 1500 },
        }),
      );
      expect(result.products).toHaveLength(1);
    });

    it('should filter products with free shipping', async () => {
      const input: IListProductsInput = {
        freeShipping: true,
      };

      const products = [mockProductEntity()];

      cacheAdapter.get.mockResolvedValue(null);
      productRepository.findByFilter.mockResolvedValue(products);

      const result = await useCase.execute(input);

      expect(productRepository.findByFilter).toHaveBeenCalledWith(
        expect.objectContaining({ freeShipping: true }),
      );
      expect(result.products).toHaveLength(1);
    });

    it('should return empty array when no products found', async () => {
      const input: IListProductsInput = {
        category: CategoryEnum.SPORTS,
      };

      cacheAdapter.get.mockResolvedValue(null);
      productRepository.findByFilter.mockResolvedValue([]);

      const result = await useCase.execute(input);

      expect(result.products).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it('should apply pagination', async () => {
      const input: IListProductsInput = {
        limit: 10,
        offset: 20,
      };

      const products = [mockProductEntity()];

      cacheAdapter.get.mockResolvedValue(null);
      productRepository.findByFilter.mockResolvedValue(products);

      await useCase.execute(input);

      expect(productRepository.findByFilter).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 10, offset: 20 }),
      );
    });

    it('should generate different cache keys for different filters', async () => {
      const input1: IListProductsInput = { category: CategoryEnum.ELECTRONICS };
      const input2: IListProductsInput = { category: CategoryEnum.CLOTHING };

      cacheAdapter.get.mockResolvedValue(null);
      productRepository.findByFilter.mockResolvedValue([]);

      await useCase.execute(input1);
      const cacheKey1 = cacheAdapter.get.mock.calls[0][0];

      await useCase.execute(input2);
      const cacheKey2 = cacheAdapter.get.mock.calls[1][0];

      expect(cacheKey1).not.toBe(cacheKey2);
    });
  });
});
