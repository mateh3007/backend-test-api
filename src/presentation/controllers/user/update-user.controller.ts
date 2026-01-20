import { Body, Controller, Param, Patch } from '@nestjs/common';
import { Roles } from '../../../infra/commons/decorators';
import { RoleEnum } from '../../../domain/enum';
import { UpdateUserUseCase } from '../../../use-cases/users';
import { UpdateUserDto } from '../../dtos';
import { BaseController, IApiResponse } from '../base.controller';
import { IUpdateUserOutput } from '../../../domain/interfaces';

@Controller('users')
export class UpdateUserController extends BaseController {
  constructor(private readonly updateUserUseCase: UpdateUserUseCase) {
    super();
  }

  @Patch(':id')
  @Roles(RoleEnum.COMPANY_OWNER)
  async handle(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<IApiResponse<IUpdateUserOutput>> {
    const result = await this.updateUserUseCase.execute({ ...dto, id });
    return this.success(result);
  }
}
