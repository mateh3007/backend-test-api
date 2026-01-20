import { Body, Controller, Param, Patch } from '@nestjs/common';
import { UpdateOrderStatusUseCase } from '../../../use-cases/orders';
import { UpdateOrderStatusDto } from '../../dtos';
import { BaseController, IApiResponse } from '../base.controller';
import { IUpdateOrderStatusOutput } from '../../../domain/interfaces';

@Controller('orders')
export class UpdateOrderStatusController extends BaseController {
  constructor(
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
  ) {
    super();
  }

  @Patch(':id/status')
  async handle(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ): Promise<IApiResponse<IUpdateOrderStatusOutput>> {
    const result = await this.updateOrderStatusUseCase.execute({ ...dto, id });
    return this.success(result);
  }
}
