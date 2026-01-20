import { CacheAdapter } from '../../domain/adapters';
import {
  IDeleteProductInput,
  IDeleteProductOutput,
} from '../../domain/interfaces';
import { ProductRepository } from '../../domain/repositories';
import { BaseUseCase } from '../base.use-case';

const PRODUCTS_LIST_CACHE_PREFIX = 'products:list:';

export class DeleteProductUseCase extends BaseUseCase<
  IDeleteProductInput,
  IDeleteProductOutput
> {
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

    await this.cacheAdapter.deleteByPattern(`${PRODUCTS_LIST_CACHE_PREFIX}*`);

    return {
      success: true,
    };
  }
}
