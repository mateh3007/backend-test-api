import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { CurrentUser } from '../../../infra/commons/decorators';
import type { ICurrentUser } from '../../../infra/commons/decorators/current-user.decorator';
import { HateoasBuilder, IHateoasLinks } from '../../../infra/commons/hateoas';
import { CreateOrderUseCase } from '../../../use-cases/orders';
import { CreateOrderDto } from '../../dtos';
import { ICreateOrderOutput } from '../../../domain/interfaces';

interface ICreateOrderResponse extends ICreateOrderOutput {
  _links: IHateoasLinks;
}

@ApiTags('Orders')
@ApiBearerAuth('JWT-auth')
@Controller('orders')
export class CreateOrderController {
  constructor(private readonly createOrderUseCase: CreateOrderUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar pedido',
    description: 'Cria um novo pedido para o usuário autenticado. O frete é calculado automaticamente usando o CEP de destino informado e o endereço do vendedor.',
  })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 201, description: 'Pedido criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Estoque insuficiente' })
  @ApiResponse({ status: 404, description: 'Produto ou endereço do vendedor não encontrado' })
  async handle(
    @Body() dto: CreateOrderDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<ICreateOrderResponse> {
    const result = await this.createOrderUseCase.execute({
      ...dto,
      buyerId: user.id,
    });

    const links = new HateoasBuilder()
      .self('/orders', 'POST')
      .add('order', `/orders/${result.id}`, 'GET')
      .add('update-status', `/orders/${result.id}/status`, 'PATCH')
      .add('product', `/products/${result.productId}`, 'GET')
      .add('buyer', `/users/${result.buyerId}`, 'GET')
      .add('seller', `/${result.sellerType.toLowerCase()}s/${result.sellerId}`, 'GET')
      .add('all-orders', '/orders', 'GET')
      .build();

    return { ...result, _links: links };
  }
}
