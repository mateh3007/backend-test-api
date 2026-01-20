import { CacheAdapter, ShippingAdapter } from '../../domain/adapters';
import { AddressableEnum, UserTypeEnum } from '../../domain/enum';
import {
  ICalculateShippingInput,
  ICalculateShippingOutput,
} from '../../domain/interfaces';
import {
  AddressRepository,
  ProductRepository,
} from '../../domain/repositories';
import { BaseUseCase } from '../base.use-case';

const SHIPPING_CACHE_TTL = 3600; // 1 hour

export class CalculateShippingUseCase extends BaseUseCase<
  ICalculateShippingInput,
  ICalculateShippingOutput
> {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly addressRepository: AddressRepository,
    private readonly shippingAdapter: ShippingAdapter,
    private readonly cacheAdapter: CacheAdapter,
  ) {
    super();
  }

  private buildCacheKey(
    originZipCode: string,
    destinationZipCode: string,
  ): string {
    return `shipping:${originZipCode}:${destinationZipCode}`;
  }

  async execute(
    input: ICalculateShippingInput,
  ): Promise<ICalculateShippingOutput> {
    const product = await this.productRepository.findById(input.productId);

    if (!product) {
      throw new Error('Product not found');
    }

    if (product.freeShipping) {
      return {
        productId: product._id,
        originZipCode: '',
        destinationZipCode: input.destinationZipCode,
        shippingCost: 0,
        estimatedDays: 0,
      };
    }

    const sellerAddress =
      await this.addressRepository.findByAddressableIdAndType(
        product.sellerId,
        product.sellerType === UserTypeEnum.COMPANY
          ? AddressableEnum.COMPANY
          : AddressableEnum.USER,
      );

    if (!sellerAddress) {
      throw new Error('Seller address not found');
    }

    const cacheKey = this.buildCacheKey(
      sellerAddress.zipCode,
      input.destinationZipCode,
    );
    const cachedResult = await this.cacheAdapter.get<{
      cost: number;
      estimatedDays: number;
    }>(cacheKey);

    if (cachedResult) {
      return {
        productId: product._id,
        originZipCode: sellerAddress.zipCode,
        destinationZipCode: input.destinationZipCode,
        shippingCost: cachedResult.cost,
        estimatedDays: cachedResult.estimatedDays,
      };
    }

    const shippingResult = await this.shippingAdapter.calculate({
      originZipCode: sellerAddress.zipCode,
      destinationZipCode: input.destinationZipCode,
    });

    await this.cacheAdapter.set(
      cacheKey,
      {
        cost: shippingResult.cost,
        estimatedDays: shippingResult.estimatedDays,
      },
      SHIPPING_CACHE_TTL,
    );

    return {
      productId: product._id,
      originZipCode: sellerAddress.zipCode,
      destinationZipCode: input.destinationZipCode,
      shippingCost: shippingResult.cost,
      estimatedDays: shippingResult.estimatedDays,
    };
  }
}
