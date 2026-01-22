import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../../infra/commons/decorators';
import type { ICurrentUser } from '../../../infra/commons/decorators/current-user.decorator';
import { HateoasBuilder, IHateoasLinks } from '../../../infra/commons/hateoas';
import { ListOrdersQueryDto } from '../../dtos';
import {
  IListOrdersOutput,
  IOrderOutput,
} from '../../../domain/interfaces';
import { ListOrdersUseCase } from '../../../use-cases/orders';

interface IOrderWithLinks extends IOrderOutput {
  _links: IHateoasLinks;
}

interface IListOrdersResponse {
  orders: IOrderWithLinks[];
  total: number;
  _links: IHateoasLinks;
}

@ApiTags('Orders')
@ApiBearerAuth('JWT-auth')
@Controller('orders')
export class ListOrdersController {
  constructor(private readonly listOrdersUseCase: ListOrdersUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Listar pedidos',
    description: 'Lista pedidos com filtros e paginação',
  })
  @ApiResponse({ status: 200, description: 'Lista de pedidos' })
  async handle(
    @Query() query: ListOrdersQueryDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<IListOrdersResponse> {
    const result = await this.listOrdersUseCase.execute({
      ...query,
      buyerId: query.buyerId || (query.sellerId ? undefined : user.id),
    });

    const ordersWithLinks: IOrderWithLinks[] = result.orders.map((order) => ({
      ...order,
      _links: new HateoasBuilder()
        .self(`/orders/${order.id}`, 'GET')
        .add('update-status', `/orders/${order.id}/status`, 'PATCH')
        .add('product', `/products/${order.productId}`, 'GET')
        .add('buyer', `/users/${order.buyerId}`, 'GET')
        .add(
          'seller',
          `/${order.sellerType.toLowerCase()}s/${order.sellerId}`,
          'GET',
        )
        .build(),
    }));

    const collectionLinks = new HateoasBuilder()
      .self('/orders', 'GET')
      .add('create', '/orders', 'POST')
      .build();

    if (query.offset !== undefined && query.limit !== undefined) {
      const nextOffset = (query.offset || 0) + (query.limit || 10);
      collectionLinks['next'] = {
        href: `/orders?offset=${nextOffset}&limit=${query.limit}${query.status ? `&status=${query.status}` : ''}${query.sellerId ? `&sellerId=${query.sellerId}` : ''}${query.sellerType ? `&sellerType=${query.sellerType}` : ''}`,
        method: 'GET',
        rel: 'next',
      };

      if (query.offset > 0) {
        const prevOffset = Math.max(0, (query.offset || 0) - (query.limit || 10));
        collectionLinks['prev'] = {
          href: `/orders?offset=${prevOffset}&limit=${query.limit}${query.status ? `&status=${query.status}` : ''}${query.sellerId ? `&sellerId=${query.sellerId}` : ''}${query.sellerType ? `&sellerType=${query.sellerType}` : ''}`,
          method: 'GET',
          rel: 'prev',
        };
      }
    }

    return {
      orders: ordersWithLinks,
      total: result.total,
      _links: collectionLinks,
    };
  }
}

