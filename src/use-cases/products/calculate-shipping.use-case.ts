import { ShippingAdapter } from "../../domain/adapters";
import { AddressableEnum, UserTypeEnum } from "../../domain/enum";
import { ICalculateShippingInput, ICalculateShippingOutput } from "../../domain/interfaces";
import { AddressRepository, ProductRepository } from "../../domain/repositories";
import { BaseUseCase } from "../base.use-case";

export class CalculateShippingUseCase extends BaseUseCase<ICalculateShippingInput, ICalculateShippingOutput> {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly addressRepository: AddressRepository,
    private readonly shippingAdapter: ShippingAdapter,
  ) {
    super();
  }

  async execute(input: ICalculateShippingInput): Promise<ICalculateShippingOutput> {
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

    const sellerAddress = await this.addressRepository.findByAddressableIdAndType(
      product.sellerId,
      product.sellerType === UserTypeEnum.COMPANY ? AddressableEnum.COMPANY : AddressableEnum.USER,
    );

    if (!sellerAddress) {
      throw new Error('Seller address not found');
    }

    const shippingResult = await this.shippingAdapter.calculate({
      originZipCode: sellerAddress.zipCode,
      destinationZipCode: input.destinationZipCode,
    });

    return {
      productId: product._id,
      originZipCode: sellerAddress.zipCode,
      destinationZipCode: input.destinationZipCode,
      shippingCost: shippingResult.cost,
      estimatedDays: shippingResult.estimatedDays,
    };
  }
}
