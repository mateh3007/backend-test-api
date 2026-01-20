import { Body, Controller, Param, Patch } from '@nestjs/common';
import { UpdateAddressUseCase } from '../../../use-cases/addresses';
import { UpdateAddressDto } from '../../dtos';
import { BaseController, IApiResponse } from '../base.controller';
import { IUpdateAddressOutput } from '../../../domain/interfaces';

@Controller('addresses')
export class UpdateAddressController extends BaseController {
  constructor(private readonly updateAddressUseCase: UpdateAddressUseCase) {
    super();
  }

  @Patch(':id')
  async handle(
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
  ): Promise<IApiResponse<IUpdateAddressOutput>> {
    const result = await this.updateAddressUseCase.execute({ ...dto, id });
    return this.success(result);
  }
}
