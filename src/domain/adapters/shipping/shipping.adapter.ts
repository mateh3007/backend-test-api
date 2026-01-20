export interface IShippingCalculateInput {
  originZipCode: string;
  destinationZipCode: string;
}

export interface IShippingCalculateOutput {
  cost: number;
  estimatedDays: number;
  carrier?: string;
}

export abstract class ShippingAdapter {
  abstract calculate(
    input: IShippingCalculateInput,
  ): Promise<IShippingCalculateOutput>;
}
