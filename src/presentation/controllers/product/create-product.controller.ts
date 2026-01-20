import { Body, Controller, Post } from '@nestjs/common';
import { CurrentUser } from '../../../infra/commons/decorators';
import type { ICurrentUser } from '../../../infra/commons/decorators/current-user.decorator';
import { UserTypeEnum } from '../../../domain/enum';
import { CreateProductUseCase } from '../../../use-cases/products';
import { CreateProductDto } from '../../dtos';
import { BaseController, IApiResponse } from '../base.controller';
import { ICreateProductOutput } from '../../../domain/interfaces';

@Controller('products')
export class CreateProductController extends BaseController {
  constructor(private readonly createProductUseCase: CreateProductUseCase) {
    super();
  }

  @Post()
  async handle(
    @Body() dto: CreateProductDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<IApiResponse<ICreateProductOutput>> {
    const input = {
      ...dto,
      sellerId: user.companyId || user.id,
      sellerType: user.companyId ? UserTypeEnum.COMPANY : UserTypeEnum.USER,
    };
    const result = await this.createProductUseCase.execute(input);
    return this.created(result);
  }
}
