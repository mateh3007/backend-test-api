import { Injectable, Logger } from '@nestjs/common';
import { CacheAdapter } from '../../domain/adapters';
import {
  IListProductsInput,
  IListProductsOutput,
} from '../../domain/interfaces';
import { ProductRepository } from '../../domain/repositories';
import { BaseUseCase } from '../base.use-case';

const PRODUCTS_LIST_CACHE_TTL = 300; // 5 minutes
const PRODUCTS_LIST_CACHE_PREFIX = 'products:list:';

@Injectable()
export class ListProductsUseCase extends BaseUseCase<
  IListProductsInput,
  IListProductsOutput
> {
  private readonly logger = new Logger(ListProductsUseCase.name);

  constructor(
    private readonly productRepository: ProductRepository,
    private readonly cacheAdapter: CacheAdapter,
  ) {
    super();
  }

  private buildCacheKey(input: IListProductsInput): string {
    const filterHash = JSON.stringify({
      name: input.name,
      category: input.category,
      sellerId: input.sellerId,
      sellerType: input.sellerType,
      freeShipping: input.freeShipping,
      priceMin: input.priceMin,
      priceMax: input.priceMax,
      limit: input.limit,
      offset: input.offset,
    });
    return `${PRODUCTS_LIST_CACHE_PREFIX}${Buffer.from(filterHash).toString('base64')}`;
  }

  async execute(input: IListProductsInput): Promise<IListProductsOutput> {
    const cacheKey = this.buildCacheKey(input);
    const cachedResult =
      await this.cacheAdapter.get<IListProductsOutput>(cacheKey);

    if (cachedResult) {
      this.logger.log(`✅ Cache HIT for products list - Key: ${cacheKey}`);
      return cachedResult;
    }

    this.logger.log(`❌ Cache MISS for products list - Key: ${cacheKey}`);

    const filter = {
      name: input.name,
      category: input.category,
      sellerId: input.sellerId,
      sellerType: input.sellerType,
      freeShipping: input.freeShipping,
      price:
        input.priceMin || input.priceMax
          ? {
              min: input.priceMin,
              max: input.priceMax,
            }
          : undefined,
      limit: input.limit,
      offset: input.offset,
    };

    const products = await this.productRepository.findByFilter(filter);

    const result: IListProductsOutput = {
      products: products.map((product) => ({
        id: product._id,
        name: product.name,
        category: product.category,
        description: product.description,
        price: product.price,
        stock: product.stock,
        freeShipping: product.freeShipping,
        sellerId: product.sellerId,
        sellerType: product.sellerType,
        createdAt: product._createdAt,
        updatedAt: product._updatedAt,
      })),
      total: products.length,
    };

    await this.cacheAdapter.set(cacheKey, result, PRODUCTS_LIST_CACHE_TTL);
    this.logger.log(
      `📦 Cache SET for products list - Key: ${cacheKey} - TTL: ${PRODUCTS_LIST_CACHE_TTL}s`,
    );

    return result;
  }
}
