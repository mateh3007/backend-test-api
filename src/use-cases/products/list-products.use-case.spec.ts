import { ListProductsUseCase } from './list-products.use-case';
import { ProductRepository } from '../../domain/repositories';
import { ProductEntity } from '../../domain/entities';
import { CategoryEnum, UserTypeEnum } from '../../domain/enum';
import { IListProductsInput } from '../../domain/interfaces';

describe('ListProductsUseCase', () => {
  let useCase: ListProductsUseCase;
  let productRepository: jest.Mocked<ProductRepository>;

  const mockProductEntity = (overrides?: Partial<ProductEntity>): ProductEntity => {
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

    useCase = new ListProductsUseCase(productRepository);
  });

  describe('execute', () => {
    it('should list all products', async () => {
      const input: IListProductsInput = {};

      const products = [
        mockProductEntity(),
        mockProductEntity({ _id: 'product-456', name: 'Samsung Galaxy' }),
      ];

      productRepository.findByFilter.mockResolvedValue(products);

      const result = await useCase.execute(input);

      expect(productRepository.findByFilter).toHaveBeenCalled();
      expect(result.products).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it('should filter products by category', async () => {
      const input: IListProductsInput = {
        category: CategoryEnum.ELECTRONICS,
      };

      const products = [mockProductEntity()];

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

      productRepository.findByFilter.mockResolvedValue(products);

      await useCase.execute(input);

      expect(productRepository.findByFilter).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 10, offset: 20 }),
      );
    });
  });
});

