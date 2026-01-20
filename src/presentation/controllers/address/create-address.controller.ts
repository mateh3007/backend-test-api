import { Body, Controller, Post } from '@nestjs/common';
import { CurrentUser } from '../../../infra/commons/decorators';
import type { ICurrentUser } from '../../../infra/commons/decorators/current-user.decorator';
import { AddressableEnum } from '../../../domain/enum';
import { CreateAddressUseCase } from '../../../use-cases/addresses';
import { CreateAddressDto } from '../../dtos';
import { BaseController, IApiResponse } from '../base.controller';
import { ICreateAddressOutput } from '../../../domain/interfaces';

@Controller('addresses')
export class CreateAddressController extends BaseController {
  constructor(private readonly createAddressUseCase: CreateAddressUseCase) {
    super();
  }

  @Post()
  async handle(
    @Body() dto: CreateAddressDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<IApiResponse<ICreateAddressOutput>> {
    const input = {
      ...dto,
      addressableId: dto.addressableId || user.id,
      addressableType: dto.addressableType || AddressableEnum.USER,
    };
    const result = await this.createAddressUseCase.execute(input);
    return this.created(result);
  }
}
