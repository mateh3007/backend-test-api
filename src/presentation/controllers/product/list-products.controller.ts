import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../../infra/commons/decorators';
import { HateoasBuilder, IHateoasLinks } from '../../../infra/commons/hateoas';
import { ListProductsUseCase } from '../../../use-cases/products';
import { ListProductsQueryDto } from '../../dtos';
import { IListProductsOutput } from '../../../domain/interfaces';

interface IProductWithLinks {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  freeShipping: boolean;
  imageUrl?: string;
  sellerId: string;
  sellerType: string;
  createdAt?: Date;
  updatedAt?: Date;
  _links: IHateoasLinks;
}

interface IListProductsResponse {
  products: IProductWithLinks[];
  total: number;
  _links: IHateoasLinks;
}

@ApiTags('Products')
@Controller('products')
export class ListProductsController {
  constructor(private readonly listProductsUseCase: ListProductsUseCase) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Listar produtos',
    description: 'Lista produtos com filtros e paginação (rota pública)',
  })
  @ApiResponse({ status: 200, description: 'Lista de produtos' })
  async handle(
    @Query() query: ListProductsQueryDto,
  ): Promise<IListProductsResponse> {
    console.log(query)
    const result = await this.listProductsUseCase.execute(query);

    const productsWithLinks: IProductWithLinks[] = result.products.map(
      (product) => ({
        ...product,
        _links: new HateoasBuilder()
          .self(`/products/${product.id}`, 'GET')
          .add('update', `/products/${product.id}`, 'PATCH')
          .add('delete', `/products/${product.id}`, 'DELETE')
          .add('shipping', `/products/${product.id}/shipping`, 'GET')
          .add('seller', `/${product.sellerType.toLowerCase()}s/${product.sellerId}`, 'GET')
          .build(),
      }),
    );

    const collectionLinks = new HateoasBuilder()
      .self('/products', 'GET')
      .add('create', '/products', 'POST')
      .build();

    if (query.offset && query.limit) {
      const nextOffset = (query.offset || 0) + (query.limit || 10);
      collectionLinks['next'] = {
        href: `/products?offset=${nextOffset}&limit=${query.limit}`,
        method: 'GET',
        rel: 'next',
      };

      if (query.offset > 0) {
        const prevOffset = Math.max(0, (query.offset || 0) - (query.limit || 10));
        collectionLinks['prev'] = {
          href: `/products?offset=${prevOffset}&limit=${query.limit}`,
          method: 'GET',
          rel: 'prev',
        };
      }
    }

    return {
      products: productsWithLinks,
      total: result.total,
      _links: collectionLinks,
    };
  }
}
