import { Controller, Delete, Param } from '@nestjs/common';
import { CurrentUser } from '../../../infra/commons/decorators';
import { ICurrentUser } from '../../../infra/commons/decorators/current-user.decorator';
import { UserTypeEnum } from '../../../domain/enum';
import { DeleteProductUseCase } from '../../../use-cases/products';
import { BaseController, IApiResponse } from '../base.controller';
import { IDeleteProductOutput } from '../../../domain/interfaces';

@Controller('products')
export class DeleteProductController extends BaseController {
  constructor(private readonly deleteProductUseCase: DeleteProductUseCase) {
    super();
  }

  @Delete(':id')
  async handle(
    @Param('id') id: string,
    @CurrentUser() user: ICurrentUser,
  ): Promise<IApiResponse<IDeleteProductOutput>> {
    const input = {
      id,
      sellerId: user.companyId || user.id,
      sellerType: user.companyId ? UserTypeEnum.COMPANY : UserTypeEnum.USER,
    };
    const result = await this.deleteProductUseCase.execute(input);
    return this.success(result);
  }
}
