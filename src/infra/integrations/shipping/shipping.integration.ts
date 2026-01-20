import { Injectable } from '@nestjs/common';
import {
  ShippingAdapter,
  IShippingCalculateInput,
  IShippingCalculateOutput,
} from '../../../domain/adapters';

interface ShippingApiResponse {
  price?: number;
  delivery_time?: number;
  company?: {
    name?: string;
  };
}

@Injectable()
export class ShippingIntegration extends ShippingAdapter {
  private readonly baseUrl =
    process.env.SHIPPING_API_URL || 'https://api.melhorenvio.com.br';
  private readonly apiKey = process.env.SHIPPING_API_KEY;

  async calculate(
    input: IShippingCalculateInput,
  ): Promise<IShippingCalculateOutput> {
    const response = await fetch(`${this.baseUrl}/v2/me/shipment/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        from: { postal_code: input.originZipCode.replace('-', '') },
        to: { postal_code: input.destinationZipCode.replace('-', '') },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to calculate shipping');
    }

    const data = (await response.json()) as
      | ShippingApiResponse
      | ShippingApiResponse[];

    const cheapestOption: ShippingApiResponse = Array.isArray(data)
      ? data[0]
      : data;

    return {
      cost: cheapestOption?.price ?? 0,
      estimatedDays: cheapestOption?.delivery_time ?? 0,
      carrier: cheapestOption?.company?.name,
    };
  }
}
