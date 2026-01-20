import { IListProductsInput, IListProductsOutput } from "../../domain/interfaces";
import { ProductRepository } from "../../domain/repositories";
import { BaseUseCase } from "../base.use-case";

export class ListProductsUseCase extends BaseUseCase<IListProductsInput, IListProductsOutput> {
  constructor(private readonly productRepository: ProductRepository) {
    super();
  }

  async execute(input: IListProductsInput): Promise<IListProductsOutput> {
    const filter = {
      name: input.name,
      category: input.category,
      sellerId: input.sellerId,
      sellerType: input.sellerType,
      freeShipping: input.freeShipping,
      price: input.priceMin || input.priceMax ? {
        min: input.priceMin,
        max: input.priceMax,
      } : undefined,
      limit: input.limit,
      offset: input.offset,
    };

    const products = await this.productRepository.findByFilter(filter);

    return {
      products: products.map(product => ({
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
  }
}

