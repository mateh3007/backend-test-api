import { IDeleteProductInput, IDeleteProductOutput } from "../../domain/interfaces";
import { ProductRepository } from "../../domain/repositories";
import { BaseUseCase } from "../base.use-case";

export class DeleteProductUseCase extends BaseUseCase<IDeleteProductInput, IDeleteProductOutput> {
  constructor(private readonly productRepository: ProductRepository) {
    super();
  }

  async execute(input: IDeleteProductInput): Promise<IDeleteProductOutput> {
    const product = await this.productRepository.findById(input.id);

    if (!product) {
      throw new Error('Product not found');
    }

    if (product.sellerId !== input.sellerId || product.sellerType !== input.sellerType) {
      throw new Error('You do not have permission to delete this product');
    }

    await this.productRepository.delete(input.id);

    return {
      success: true,
    };
  }
}

