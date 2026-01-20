import { Controller, Delete, HttpCode, HttpStatus, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../../infra/commons/decorators';
import type { ICurrentUser } from '../../../infra/commons/decorators/current-user.decorator';
import { HateoasBuilder, IHateoasLinks } from '../../../infra/commons/hateoas';
import { UserTypeEnum } from '../../../domain/enum';
import { DeleteProductUseCase } from '../../../use-cases/products';
import { IDeleteProductOutput } from '../../../domain/interfaces';

interface IDeleteProductResponse extends IDeleteProductOutput {
  _links: IHateoasLinks;
}

@ApiTags('Products')
@ApiBearerAuth('JWT-auth')
@Controller('products')
export class DeleteProductController {
  constructor(private readonly deleteProductUseCase: DeleteProductUseCase) {}

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Excluir produto',
    description: 'Exclui um produto do vendedor autenticado',
  })
  @ApiParam({ name: 'id', description: 'ID do produto' })
  @ApiResponse({ status: 200, description: 'Produto excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async handle(
    @Param('id') id: string,
    @CurrentUser() user: ICurrentUser,
  ): Promise<IDeleteProductResponse> {
    const result = await this.deleteProductUseCase.execute({
      id,
      sellerId: user.companyId || user.id,
      sellerType: user.companyId ? UserTypeEnum.COMPANY : UserTypeEnum.USER,
    });

    const links = new HateoasBuilder()
      .self(`/products/${id}`, 'DELETE')
      .add('all-products', '/products', 'GET')
      .add('create-product', '/products', 'POST')
      .build();

    return { ...result, _links: links };
  }
}
