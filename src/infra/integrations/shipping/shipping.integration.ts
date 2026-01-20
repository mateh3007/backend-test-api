import { Injectable, Logger } from '@nestjs/common';
import {
  ShippingAdapter,
  IShippingCalculateInput,
  IShippingCalculateOutput,
} from '../../../domain/adapters';

interface ShippingApiResponse {
  valor: string | null;
  prazo: string | null;
  servico: string;
  origem: string;
  destino: string;
}

@Injectable()
export class ShippingIntegration extends ShippingAdapter {
  private readonly logger = new Logger(ShippingIntegration.name);
  private readonly baseUrl =
    process.env.SHIPPING_API_URL ||
    'https://showcommerce.com.br/api/calculadora-frete';

  private readonly defaultWeight = '1';
  private readonly defaultService = 'sedex';

  async calculate(
    input: IShippingCalculateInput,
  ): Promise<IShippingCalculateOutput> {
    const originZipCode = input.originZipCode.replace(/\D/g, '');
    const destinationZipCode = input.destinationZipCode.replace(/\D/g, '');

    const url = `${this.baseUrl}/?cep_origem=${originZipCode}&cep_destino=${destinationZipCode}&servico=${this.defaultService}&peso=${this.defaultWeight}`;

    this.logger.log(
      `📦 Calculating shipping: ${originZipCode} → ${destinationZipCode}`,
    );

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      this.logger.error(`❌ Shipping API error: ${response.status}`);
      throw new Error('Failed to calculate shipping');
    }

    const data = (await response.json()) as ShippingApiResponse;

    if (!data.valor || !data.prazo) {
      this.logger.warn(`⚠️ Shipping not available for this route`);
      throw new Error('Shipping not available for this route');
    }

    const cost = parseFloat(data.valor);
    const estimatedDays = parseInt(data.prazo, 10);

    this.logger.log(
      `✅ Shipping calculated: R$ ${cost.toFixed(2)} - ${estimatedDays} day(s) - ${data.servico.toUpperCase()}`,
    );

    return {
      cost,
      estimatedDays,
      carrier: data.servico.toUpperCase(),
    };
  }
}
