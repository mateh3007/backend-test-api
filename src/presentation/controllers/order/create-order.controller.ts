import { Body, Controller, Post } from '@nestjs/common';
import { CurrentUser } from '../../../infra/commons/decorators';
import { ICurrentUser } from '../../../infra/commons/decorators/current-user.decorator';
import { UserTypeEnum } from '../../../domain/enum';
import { CreateOrderUseCase } from '../../../use-cases/orders';
import { CreateOrderDto } from '../../dtos';
import { BaseController, IApiResponse } from '../base.controller';
import { ICreateOrderOutput } from '../../../domain/interfaces';

@Controller('orders')
export class CreateOrderController extends BaseController {
  constructor(private readonly createOrderUseCase: CreateOrderUseCase) {
    super();
  }

  @Post()
  async handle(
    @Body() dto: CreateOrderDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<IApiResponse<ICreateOrderOutput>> {
    const input = {
      ...dto,
      buyerId: user.id,
      sellerId: '',
      sellerType: UserTypeEnum.USER,
    };
    const result = await this.createOrderUseCase.execute(input);
    return this.created(result);
  }
}

