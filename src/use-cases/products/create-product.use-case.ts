import { Injectable, Logger } from '@nestjs/common';
import { CacheAdapter } from '../../domain/adapters';
import { ProductEntity } from '../../domain/entities';
import {
  ICreateProductInput,
  ICreateProductOutput,
} from '../../domain/interfaces';
import { ProductRepository } from '../../domain/repositories';
import { BaseUseCase } from '../base.use-case';

const PRODUCTS_LIST_CACHE_PREFIX = 'products:list:';

@Injectable()
export class CreateProductUseCase extends BaseUseCase<
  ICreateProductInput,
  ICreateProductOutput
> {
  private readonly logger = new Logger(CreateProductUseCase.name);

  constructor(
    private readonly productRepository: ProductRepository,
    private readonly cacheAdapter: CacheAdapter,
  ) {
    super();
  }

  async execute(input: ICreateProductInput): Promise<ICreateProductOutput> {
    const product = new ProductEntity({});
    product.name = input.name;
    product.category = input.category;
    product.description = input.description;
    product.price = input.price;
    product.stock = input.stock;
    product.freeShipping = input.freeShipping;
    product.imageUrl = input.imageUrl;
    product.sellerId = input.sellerId;
    product.sellerType = input.sellerType;

    const createdProduct = await this.productRepository.create(product);

    this.logger.log(`📝 Product created: ${createdProduct._id}`);

    try {
      await this.cacheAdapter.deleteByPattern(`${PRODUCTS_LIST_CACHE_PREFIX}*`);
      this.logger.log(
        `🗑️ Cache INVALIDATED - Pattern: ${PRODUCTS_LIST_CACHE_PREFIX}*`,
      );
    } catch (error) {
      this.logger.warn(`⚠️ Failed to invalidate cache (non-critical): ${error instanceof Error ? error.message : String(error)}`);
    }

    return {
      id: createdProduct._id,
      name: createdProduct.name,
      category: createdProduct.category,
      description: createdProduct.description,
      price: createdProduct.price,
      stock: createdProduct.stock,
      freeShipping: createdProduct.freeShipping,
      imageUrl: createdProduct.imageUrl,
      sellerId: createdProduct.sellerId,
      sellerType: createdProduct.sellerType,
      createdAt: createdProduct._createdAt,
    };
  }
}
