import { Injectable, Logger } from '@nestjs/common';
import { CacheAdapter } from '../../domain/adapters';
import {
  IUpdateProductInput,
  IUpdateProductOutput,
} from '../../domain/interfaces';
import { ProductRepository } from '../../domain/repositories';
import { BaseUseCase } from '../base.use-case';

const PRODUCTS_LIST_CACHE_PREFIX = 'products:list:';

@Injectable()
export class UpdateProductUseCase extends BaseUseCase<
  IUpdateProductInput,
  IUpdateProductOutput
> {
  private readonly logger = new Logger(UpdateProductUseCase.name);

  constructor(
    private readonly productRepository: ProductRepository,
    private readonly cacheAdapter: CacheAdapter,
  ) {
    super();
  }

  async execute(input: IUpdateProductInput): Promise<IUpdateProductOutput> {
    const product = await this.productRepository.findById(input.id);

    if (!product) {
      throw new Error('Product not found');
    }

    if (input.name !== undefined) {
      product.name = input.name;
    }

    if (input.category !== undefined) {
      product.category = input.category;
    }

    if (input.description !== undefined) {
      product.description = input.description;
    }

    if (input.price !== undefined) {
      product.price = input.price;
    }

    if (input.stock !== undefined) {
      product.stock = input.stock;
    }

    if (input.freeShipping !== undefined) {
      product.freeShipping = input.freeShipping;
    }

    if (input.imageUrl !== undefined) {
      product.imageUrl = input.imageUrl;
    }

    const updatedProduct = await this.productRepository.update(product);

    this.logger.log(`✏️ Product updated: ${updatedProduct._id}`);

    try {
      await this.cacheAdapter.deleteByPattern(`${PRODUCTS_LIST_CACHE_PREFIX}*`);
      this.logger.log(
        `🗑️ Cache INVALIDATED - Pattern: ${PRODUCTS_LIST_CACHE_PREFIX}*`,
      );
    } catch (error) {
      this.logger.warn(`⚠️ Failed to invalidate cache (non-critical): ${error instanceof Error ? error.message : String(error)}`);
    }

    return {
      id: updatedProduct._id,
      name: updatedProduct.name,
      category: updatedProduct.category,
      description: updatedProduct.description,
      price: updatedProduct.price,
      stock: updatedProduct.stock,
      freeShipping: updatedProduct.freeShipping,
      imageUrl: updatedProduct.imageUrl,
      sellerId: updatedProduct.sellerId,
      sellerType: updatedProduct.sellerType,
      updatedAt: updatedProduct._updatedAt,
    };
  }
}
