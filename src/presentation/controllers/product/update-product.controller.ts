import { Body, Controller, Param, Patch } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { HateoasBuilder, IHateoasLinks } from '../../../infra/commons/hateoas';
import { UpdateProductUseCase } from '../../../use-cases/products';
import { UpdateProductDto } from '../../dtos';
import { IUpdateProductOutput } from '../../../domain/interfaces';

interface IUpdateProductResponse extends IUpdateProductOutput {
  _links: IHateoasLinks;
}

@ApiTags('Products')
@ApiBearerAuth('JWT-auth')
@Controller('products')
export class UpdateProductController {
  constructor(private readonly updateProductUseCase: UpdateProductUseCase) {}

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar produto',
    description: 'Atualiza um produto existente',
  })
  @ApiParam({ name: 'id', description: 'ID do produto' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async handle(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<IUpdateProductResponse> {
    const result = await this.updateProductUseCase.execute({ ...dto, id });

    const links = new HateoasBuilder()
      .self(`/products/${id}`, 'PATCH')
      .add('product', `/products/${id}`, 'GET')
      .add('delete', `/products/${id}`, 'DELETE')
      .add('shipping', `/products/${id}/shipping`, 'GET')
      .add('seller', `/${(result.sellerType || 'user').toLowerCase()}s/${result.sellerId}`, 'GET')
      .add('all-products', '/products', 'GET')
      .build();

    return { ...result, _links: links };
  }
}
