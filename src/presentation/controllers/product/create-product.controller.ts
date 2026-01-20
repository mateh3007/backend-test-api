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
import { UserTypeEnum } from '../../../domain/enum';
import { CreateProductUseCase } from '../../../use-cases/products';
import { CreateProductDto } from '../../dtos';
import { ICreateProductOutput } from '../../../domain/interfaces';

interface ICreateProductResponse extends ICreateProductOutput {
  _links: IHateoasLinks;
}

@ApiTags('Products')
@ApiBearerAuth('JWT-auth')
@Controller('products')
export class CreateProductController {
  constructor(private readonly createProductUseCase: CreateProductUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar produto',
    description: 'Cria um novo produto para o usuário/empresa autenticado',
  })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso' })
  async handle(
    @Body() dto: CreateProductDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<ICreateProductResponse> {
    const result = await this.createProductUseCase.execute({
      ...dto,
      sellerId: user.companyId || user.id,
      sellerType: user.companyId ? UserTypeEnum.COMPANY : UserTypeEnum.USER,
    });

    const links = new HateoasBuilder()
      .self('/products', 'POST')
      .add('product', `/products/${result.id}`, 'GET')
      .add('update', `/products/${result.id}`, 'PATCH')
      .add('delete', `/products/${result.id}`, 'DELETE')
      .add('shipping', `/products/${result.id}/shipping`, 'GET')
      .add('seller', `/${result.sellerType.toLowerCase()}s/${result.sellerId}`, 'GET')
      .add('all-products', '/products', 'GET')
      .build();

    return { ...result, _links: links };
  }
}
