import { Injectable, Logger } from '@nestjs/common';
import { CacheAdapter } from '../../domain/adapters';
import {
  IDeleteProductInput,
  IDeleteProductOutput,
} from '../../domain/interfaces';
import { ProductRepository } from '../../domain/repositories';
import { BaseUseCase } from '../base.use-case';

const PRODUCTS_LIST_CACHE_PREFIX = 'products:list:';

@Injectable()
export class DeleteProductUseCase extends BaseUseCase<
  IDeleteProductInput,
  IDeleteProductOutput
> {
  private readonly logger = new Logger(DeleteProductUseCase.name);

  constructor(
    private readonly productRepository: ProductRepository,
    private readonly cacheAdapter: CacheAdapter,
  ) {
    super();
  }

  async execute(input: IDeleteProductInput): Promise<IDeleteProductOutput> {
    const product = await this.productRepository.findById(input.id);

    if (!product) {
      throw new Error('Product not found');
    }

    if (
      product.sellerId !== input.sellerId ||
      product.sellerType !== input.sellerType
    ) {
      throw new Error('You do not have permission to delete this product');
    }

    await this.productRepository.delete(input.id);

    this.logger.log(`🗑️ Product deleted: ${input.id}`);

    try {
      await this.cacheAdapter.deleteByPattern(`${PRODUCTS_LIST_CACHE_PREFIX}*`);
      this.logger.log(
        `🗑️ Cache INVALIDATED - Pattern: ${PRODUCTS_LIST_CACHE_PREFIX}*`,
      );
    } catch (error) {
      this.logger.warn(`⚠️ Failed to invalidate cache (non-critical): ${error instanceof Error ? error.message : String(error)}`);
    }

    return {
      success: true,
    };
  }
}
