import { UpdateProductUseCase } from './update-product.use-case';
import { CacheAdapter } from '../../domain/adapters';
import { ProductRepository } from '../../domain/repositories';
import { ProductEntity } from '../../domain/entities';
import { CategoryEnum, UserTypeEnum } from '../../domain/enum';
import { IUpdateProductInput } from '../../domain/interfaces';

describe('UpdateProductUseCase', () => {
  let useCase: UpdateProductUseCase;
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
    product._updatedAt = new Date('2026-01-02');
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

    useCase = new UpdateProductUseCase(productRepository, cacheAdapter);
  });

  describe('execute', () => {
    it('should update product name successfully and invalidate cache', async () => {
      const input: IUpdateProductInput = {
        id: 'product-123',
        name: 'iPhone 16',
      };

      const existingProduct = mockProductEntity();
      const updatedProduct = mockProductEntity();
      updatedProduct.name = 'iPhone 16';

      productRepository.findById.mockResolvedValue(existingProduct);
      productRepository.update.mockResolvedValue(updatedProduct);

      const result = await useCase.execute(input);

      expect(productRepository.findById).toHaveBeenCalledWith('product-123');
      expect(cacheAdapter.deleteByPattern).toHaveBeenCalledWith('products:list:*');
      expect(result.name).toBe('iPhone 16');
    });

    it('should throw error if product not found', async () => {
      const input: IUpdateProductInput = {
        id: 'non-existent',
        name: 'New Name',
      };

      productRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(input)).rejects.toThrow('Product not found');
      expect(productRepository.update).not.toHaveBeenCalled();
      expect(cacheAdapter.deleteByPattern).not.toHaveBeenCalled();
    });

    it('should update product price successfully', async () => {
      const input: IUpdateProductInput = {
        id: 'product-123',
        price: 899.99,
      };

      const existingProduct = mockProductEntity();
      const updatedProduct = mockProductEntity();
      updatedProduct.price = 899.99;

      productRepository.findById.mockResolvedValue(existingProduct);
      productRepository.update.mockResolvedValue(updatedProduct);

      const result = await useCase.execute(input);

      expect(result.price).toBe(899.99);
    });

    it('should update product stock successfully', async () => {
      const input: IUpdateProductInput = {
        id: 'product-123',
        stock: 50,
      };

      const existingProduct = mockProductEntity();
      const updatedProduct = mockProductEntity();
      updatedProduct.stock = 50;

      productRepository.findById.mockResolvedValue(existingProduct);
      productRepository.update.mockResolvedValue(updatedProduct);

      const result = await useCase.execute(input);

      expect(result.stock).toBe(50);
    });

    it('should update product category successfully', async () => {
      const input: IUpdateProductInput = {
        id: 'product-123',
        category: CategoryEnum.HOME,
      };

      const existingProduct = mockProductEntity();
      const updatedProduct = mockProductEntity();
      updatedProduct.category = CategoryEnum.HOME;

      productRepository.findById.mockResolvedValue(existingProduct);
      productRepository.update.mockResolvedValue(updatedProduct);

      const result = await useCase.execute(input);

      expect(result.category).toBe(CategoryEnum.HOME);
    });

    it('should update multiple fields at once', async () => {
      const input: IUpdateProductInput = {
        id: 'product-123',
        name: 'iPhone 16 Pro',
        price: 1199.99,
        stock: 200,
        freeShipping: false,
      };

      const existingProduct = mockProductEntity();
      const updatedProduct = mockProductEntity();
      updatedProduct.name = 'iPhone 16 Pro';
      updatedProduct.price = 1199.99;
      updatedProduct.stock = 200;
      updatedProduct.freeShipping = false;

      productRepository.findById.mockResolvedValue(existingProduct);
      productRepository.update.mockResolvedValue(updatedProduct);

      const result = await useCase.execute(input);

      expect(result.name).toBe('iPhone 16 Pro');
      expect(result.price).toBe(1199.99);
      expect(result.stock).toBe(200);
      expect(result.freeShipping).toBe(false);
    });

    it('should preserve sellerId and sellerType on update', async () => {
      const input: IUpdateProductInput = {
        id: 'product-123',
        name: 'Updated Name',
      };

      const existingProduct = mockProductEntity();
      const updatedProduct = mockProductEntity();
      updatedProduct.name = 'Updated Name';

      productRepository.findById.mockResolvedValue(existingProduct);
      productRepository.update.mockResolvedValue(updatedProduct);

      const result = await useCase.execute(input);

      expect(result.sellerId).toBe('seller-123');
      expect(result.sellerType).toBe(UserTypeEnum.COMPANY);
    });
  });
});
