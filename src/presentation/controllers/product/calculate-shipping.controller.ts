import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../../../infra/commons/decorators';
import { HateoasBuilder, IHateoasLinks } from '../../../infra/commons/hateoas';
import { CalculateShippingUseCase } from '../../../use-cases/products';
import { CalculateShippingDto } from '../../dtos';
import { ICalculateShippingOutput } from '../../../domain/interfaces';

interface ICalculateShippingResponse extends ICalculateShippingOutput {
  _links: IHateoasLinks;
}

@ApiTags('Products')
@Public()
@Controller('products')
export class CalculateShippingController {
  constructor(
    private readonly calculateShippingUseCase: CalculateShippingUseCase,
  ) {}

  @Public()
  @Get(':id/shipping')
  @ApiOperation({
    summary: 'Calcular frete',
    description: 'Calcula o frete de um produto usando o endereço do vendedor como origem',
  })
  @ApiParam({ name: 'id', description: 'ID do produto' })
  @ApiResponse({ status: 200, description: 'Frete calculado com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto ou endereço do vendedor não encontrado' })
  async handle(
    @Param('id') productId: string,
    @Query() query: CalculateShippingDto,
  ): Promise<ICalculateShippingResponse> {
    const result = await this.calculateShippingUseCase.execute({
      productId,
      destinationZipCode: query.destinationZipCode,
    });

    const links = new HateoasBuilder()
      .self(`/products/${productId}/shipping?destinationZipCode=${query.destinationZipCode}`, 'GET')
      .add('product', `/products/${productId}`, 'GET')
      .add('create-order', '/orders', 'POST')
      .build();

    return { ...result, _links: links };
  }
}
