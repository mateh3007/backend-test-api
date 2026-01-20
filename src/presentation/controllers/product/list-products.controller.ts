import { Controller, Get, Query } from '@nestjs/common';
import { Public } from '../../../infra/commons/decorators';
import { ListProductsUseCase } from '../../../use-cases/products';
import { ListProductsQueryDto } from '../../dtos';
import { BaseController, IApiResponse } from '../base.controller';
import { IListProductsOutput } from '../../../domain/interfaces';

@Controller('products')
export class ListProductsController extends BaseController {
  constructor(private readonly listProductsUseCase: ListProductsUseCase) {
    super();
  }

  @Public()
  @Get()
  async handle(
    @Query() query: ListProductsQueryDto,
  ): Promise<IApiResponse<IListProductsOutput>> {
    const result = await this.listProductsUseCase.execute(query);
    return this.success(result);
  }
}
