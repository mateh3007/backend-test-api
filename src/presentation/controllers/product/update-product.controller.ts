import { Body, Controller, Param, Patch } from '@nestjs/common';
import { UpdateProductUseCase } from '../../../use-cases/products';
import { UpdateProductDto } from '../../dtos';
import { BaseController, IApiResponse } from '../base.controller';
import { IUpdateProductOutput } from '../../../domain/interfaces';

@Controller('products')
export class UpdateProductController extends BaseController {
  constructor(private readonly updateProductUseCase: UpdateProductUseCase) {
    super();
  }

  @Patch(':id')
  async handle(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<IApiResponse<IUpdateProductOutput>> {
    const result = await this.updateProductUseCase.execute({ ...dto, id });
    return this.success(result);
  }
}

