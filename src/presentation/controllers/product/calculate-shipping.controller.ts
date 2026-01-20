import { Controller, Get, Param, Query } from '@nestjs/common';
import { Public } from '../../../infra/commons/decorators';
import { CalculateShippingUseCase } from '../../../use-cases/products';
import { CalculateShippingDto } from '../../dtos';
import { BaseController, IApiResponse } from '../base.controller';
import { ICalculateShippingOutput } from '../../../domain/interfaces';

@Controller('products')
export class CalculateShippingController extends BaseController {
  constructor(
    private readonly calculateShippingUseCase: CalculateShippingUseCase,
  ) {
    super();
  }

  @Public()
  @Get(':id/shipping')
  async handle(
    @Param('id') productId: string,
    @Query() query: CalculateShippingDto,
  ): Promise<IApiResponse<ICalculateShippingOutput>> {
    const result = await this.calculateShippingUseCase.execute({
      productId,
      destinationZipCode: query.destinationZipCode,
    });
    return this.success(result);
  }
}
