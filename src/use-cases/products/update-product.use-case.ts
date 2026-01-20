import { CacheAdapter } from "../../domain/adapters";
import { IUpdateProductInput, IUpdateProductOutput } from "../../domain/interfaces";
import { ProductRepository } from "../../domain/repositories";
import { BaseUseCase } from "../base.use-case";

const PRODUCTS_LIST_CACHE_PREFIX = 'products:list:';

export class UpdateProductUseCase extends BaseUseCase<IUpdateProductInput, IUpdateProductOutput> {
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

    const updatedProduct = await this.productRepository.update(product);

    await this.cacheAdapter.deleteByPattern(`${PRODUCTS_LIST_CACHE_PREFIX}*`);

    return {
      id: updatedProduct._id,
      name: updatedProduct.name,
      category: updatedProduct.category,
      description: updatedProduct.description,
      price: updatedProduct.price,
      stock: updatedProduct.stock,
      freeShipping: updatedProduct.freeShipping,
      sellerId: updatedProduct.sellerId,
      sellerType: updatedProduct.sellerType,
      updatedAt: updatedProduct._updatedAt,
    };
  }
}
