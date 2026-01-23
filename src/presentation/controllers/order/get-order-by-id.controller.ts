import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HateoasBuilder, IHateoasLinks } from '../../../infra/commons/hateoas';
import { GetOrderByIdUseCase } from '../../../use-cases/orders';

interface IGetOrderResponse {
  id: string;
  productId: string;
  productQuantity: number;
  shippingCost: number;
  totalPrice: number;
  status: string;
  sellerId: string;
  sellerType: string;
  buyerId: string;
  createdAt: Date;
  updatedAt: Date;
  _links: IHateoasLinks;
}

@ApiTags('Orders')
@ApiBearerAuth('JWT-auth')
@Controller('orders')
export class GetOrderByIdController {
  constructor(private readonly getOrderByIdUseCase: GetOrderByIdUseCase) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar pedido por ID',
    description: 'Retorna os detalhes de um pedido específico',
  })
  @ApiParam({ name: 'id', description: 'ID do pedido' })
  @ApiResponse({ status: 200, description: 'Pedido encontrado' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  async handle(@Param('id') id: string): Promise<IGetOrderResponse> {
    const result = await this.getOrderByIdUseCase.execute({ id });

    const links = new HateoasBuilder()
      .self(`/orders/${id}`, 'GET')
      .add('update-status', `/orders/${id}/status`, 'PATCH')
      .add('product', `/products/${result.productId}`, 'GET')
      .add('buyer', `/users/${result.buyerId}`, 'GET')
      .add(
        'seller',
        `/${result.sellerType.toLowerCase()}s/${result.sellerId}`,
        'GET',
      )
      .add('all-orders', '/orders', 'GET')
      .build();

    return { ...result, _links: links };
  }
}


