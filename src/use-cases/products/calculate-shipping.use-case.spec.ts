import { CalculateShippingUseCase } from './calculate-shipping.use-case';
import { CacheAdapter, ShippingAdapter } from '../../domain/adapters';
import {
  AddressRepository,
  ProductRepository,
} from '../../domain/repositories';
import { AddressEntity, ProductEntity } from '../../domain/entities';
import { AddressableEnum, CategoryEnum, UserTypeEnum } from '../../domain/enum';
import { ICalculateShippingInput } from '../../domain/interfaces';

describe('CalculateShippingUseCase', () => {
  let useCase: CalculateShippingUseCase;
  let productRepository: jest.Mocked<ProductRepository>;
  let addressRepository: jest.Mocked<AddressRepository>;
  let shippingAdapter: jest.Mocked<ShippingAdapter>;
  let cacheAdapter: jest.Mocked<CacheAdapter>;

  const mockProductEntity = (): ProductEntity => {
    const product = new ProductEntity({});
    product._id = 'product-123';
    product.name = 'iPhone 15';
    product.category = CategoryEnum.ELECTRONICS;
    product.description = 'Latest Apple smartphone';
    product.price = 999.99;
    product.stock = 100;
    product.freeShipping = false;
    product.sellerId = 'seller-123';
    product.sellerType = UserTypeEnum.COMPANY;
    product._createdAt = new Date('2026-01-01');
    product._updatedAt = new Date('2026-01-01');
    return product;
  };

  const mockAddressEntity = (): AddressEntity => {
    const address = new AddressEntity({});
    address._id = 'address-123';
    address.country = 'Brazil';
    address.state = 'SP';
    address.city = 'São Paulo';
    address.street = 'Av. Paulista';
    address.number = '1000';
    address.zipCode = '01310-100';
    address.addressableId = 'seller-123';
    address.addressableType = AddressableEnum.COMPANY;
    return address;
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

    addressRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByAddressableIdAndType: jest.fn(),
    } as jest.Mocked<AddressRepository>;

    shippingAdapter = {
      calculate: jest.fn(),
    } as jest.Mocked<ShippingAdapter>;

    cacheAdapter = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
      deleteByPattern: jest.fn(),
    } as jest.Mocked<CacheAdapter>;

    useCase = new CalculateShippingUseCase(
      productRepository,
      addressRepository,
      shippingAdapter,
      cacheAdapter,
    );
  });

  describe('execute', () => {
    it('should calculate shipping successfully and cache result', async () => {
      const input: ICalculateShippingInput = {
        productId: 'product-123',
        destinationZipCode: '04567-000',
      };

      const product = mockProductEntity();
      const sellerAddress = mockAddressEntity();

      productRepository.findById.mockResolvedValue(product);
      addressRepository.findByAddressableIdAndType.mockResolvedValue(
        sellerAddress,
      );
      cacheAdapter.get.mockResolvedValue(null);
      shippingAdapter.calculate.mockResolvedValue({
        cost: 25.5,
        estimatedDays: 5,
      });

      const result = await useCase.execute(input);

      expect(productRepository.findById).toHaveBeenCalledWith('product-123');
      expect(addressRepository.findByAddressableIdAndType).toHaveBeenCalledWith(
        'seller-123',
        'COMPANY',
      );
      expect(cacheAdapter.get).toHaveBeenCalledWith(
        'shipping:01310-100:04567-000',
      );
      expect(shippingAdapter.calculate).toHaveBeenCalledWith({
        originZipCode: '01310-100',
        destinationZipCode: '04567-000',
      });
      expect(cacheAdapter.set).toHaveBeenCalledWith(
        'shipping:01310-100:04567-000',
        { cost: 25.5, estimatedDays: 5 },
        3600,
      );
      expect(result.shippingCost).toBe(25.5);
      expect(result.estimatedDays).toBe(5);
      expect(result.originZipCode).toBe('01310-100');
      expect(result.destinationZipCode).toBe('04567-000');
    });

    it('should return cached result when available', async () => {
      const input: ICalculateShippingInput = {
        productId: 'product-123',
        destinationZipCode: '04567-000',
      };

      const product = mockProductEntity();
      const sellerAddress = mockAddressEntity();

      productRepository.findById.mockResolvedValue(product);
      addressRepository.findByAddressableIdAndType.mockResolvedValue(
        sellerAddress,
      );
      cacheAdapter.get.mockResolvedValue({ cost: 25.5, estimatedDays: 5 });

      const result = await useCase.execute(input);

      expect(cacheAdapter.get).toHaveBeenCalledWith(
        'shipping:01310-100:04567-000',
      );
      expect(shippingAdapter.calculate).not.toHaveBeenCalled();
      expect(cacheAdapter.set).not.toHaveBeenCalled();
      expect(result.shippingCost).toBe(25.5);
      expect(result.estimatedDays).toBe(5);
    });

    it('should return free shipping when product has freeShipping', async () => {
      const input: ICalculateShippingInput = {
        productId: 'product-123',
        destinationZipCode: '04567-000',
      };

      const product = mockProductEntity();
      product.freeShipping = true;

      productRepository.findById.mockResolvedValue(product);

      const result = await useCase.execute(input);

      expect(result.shippingCost).toBe(0);
      expect(result.estimatedDays).toBe(0);
      expect(shippingAdapter.calculate).not.toHaveBeenCalled();
      expect(cacheAdapter.get).not.toHaveBeenCalled();
    });

    it('should throw error if product not found', async () => {
      const input: ICalculateShippingInput = {
        productId: 'non-existent',
        destinationZipCode: '04567-000',
      };

      productRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(input)).rejects.toThrow('Product not found');
    });

    it('should throw error if seller address not found', async () => {
      const input: ICalculateShippingInput = {
        productId: 'product-123',
        destinationZipCode: '04567-000',
      };

      const product = mockProductEntity();

      productRepository.findById.mockResolvedValue(product);
      addressRepository.findByAddressableIdAndType.mockResolvedValue(null);

      await expect(useCase.execute(input)).rejects.toThrow(
        'Seller address not found',
      );
    });

    it('should calculate shipping for user seller', async () => {
      const input: ICalculateShippingInput = {
        productId: 'product-123',
        destinationZipCode: '04567-000',
      };

      const product = mockProductEntity();
      product.sellerId = 'user-456';
      product.sellerType = UserTypeEnum.USER;

      const sellerAddress = mockAddressEntity();
      sellerAddress.addressableId = 'user-456';
      sellerAddress.addressableType = AddressableEnum.USER;

      productRepository.findById.mockResolvedValue(product);
      addressRepository.findByAddressableIdAndType.mockResolvedValue(
        sellerAddress,
      );
      cacheAdapter.get.mockResolvedValue(null);
      shippingAdapter.calculate.mockResolvedValue({
        cost: 30.0,
        estimatedDays: 7,
      });

      const result = await useCase.execute(input);

      expect(addressRepository.findByAddressableIdAndType).toHaveBeenCalledWith(
        'user-456',
        'USER',
      );
      expect(result.shippingCost).toBe(30.0);
    });
  });
});
