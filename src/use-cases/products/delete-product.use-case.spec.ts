import { DeleteProductUseCase } from './delete-product.use-case';
import { CacheAdapter } from '../../domain/adapters';
import { ProductRepository } from '../../domain/repositories';
import { ProductEntity } from '../../domain/entities';
import { CategoryEnum, UserTypeEnum } from '../../domain/enum';
import { IDeleteProductInput } from '../../domain/interfaces';

describe('DeleteProductUseCase', () => {
  let useCase: DeleteProductUseCase;
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

    useCase = new DeleteProductUseCase(productRepository, cacheAdapter);
  });

  describe('execute', () => {
    it('should delete product successfully and invalidate cache', async () => {
      const input: IDeleteProductInput = {
        id: 'product-123',
        sellerId: 'seller-123',
        sellerType: UserTypeEnum.COMPANY,
      };

      const product = mockProductEntity();

      productRepository.findById.mockResolvedValue(product);
      productRepository.delete.mockResolvedValue();

      const result = await useCase.execute(input);

      expect(productRepository.findById).toHaveBeenCalledWith('product-123');
      expect(productRepository.delete).toHaveBeenCalledWith('product-123');
      expect(cacheAdapter.deleteByPattern).toHaveBeenCalledWith(
        'products:list:*',
      );
      expect(result.success).toBe(true);
    });

    it('should throw error if product not found', async () => {
      const input: IDeleteProductInput = {
        id: 'non-existent',
        sellerId: 'seller-123',
        sellerType: UserTypeEnum.COMPANY,
      };

      productRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(input)).rejects.toThrow('Product not found');
      expect(productRepository.delete).not.toHaveBeenCalled();
      expect(cacheAdapter.deleteByPattern).not.toHaveBeenCalled();
    });

    it('should throw error if seller does not own the product', async () => {
      const input: IDeleteProductInput = {
        id: 'product-123',
        sellerId: 'other-seller',
        sellerType: UserTypeEnum.COMPANY,
      };

      const product = mockProductEntity();

      productRepository.findById.mockResolvedValue(product);

      await expect(useCase.execute(input)).rejects.toThrow(
        'You do not have permission to delete this product',
      );
      expect(productRepository.delete).not.toHaveBeenCalled();
      expect(cacheAdapter.deleteByPattern).not.toHaveBeenCalled();
    });

    it('should throw error if sellerType does not match', async () => {
      const input: IDeleteProductInput = {
        id: 'product-123',
        sellerId: 'seller-123',
        sellerType: UserTypeEnum.USER,
      };

      const product = mockProductEntity();

      productRepository.findById.mockResolvedValue(product);

      await expect(useCase.execute(input)).rejects.toThrow(
        'You do not have permission to delete this product',
      );
      expect(productRepository.delete).not.toHaveBeenCalled();
      expect(cacheAdapter.deleteByPattern).not.toHaveBeenCalled();
    });

    it('should allow user to delete their own product', async () => {
      const input: IDeleteProductInput = {
        id: 'product-123',
        sellerId: 'user-456',
        sellerType: UserTypeEnum.USER,
      };

      const product = mockProductEntity();
      product.sellerId = 'user-456';
      product.sellerType = UserTypeEnum.USER;

      productRepository.findById.mockResolvedValue(product);
      productRepository.delete.mockResolvedValue();

      const result = await useCase.execute(input);

      expect(result.success).toBe(true);
      expect(cacheAdapter.deleteByPattern).toHaveBeenCalledWith(
        'products:list:*',
      );
    });
  });
});
