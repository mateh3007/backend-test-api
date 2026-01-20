import { Body, Controller, ForbiddenException, Param, Patch } from '@nestjs/common';
import { CurrentUser, Roles } from '../../../infra/commons/decorators';
import { ICurrentUser } from '../../../infra/commons/decorators/current-user.decorator';
import { RoleEnum } from '../../../domain/enum';
import { UpdateCompanyUseCase } from '../../../use-cases/companies';
import { UpdateCompanyDto } from '../../dtos';
import { BaseController, IApiResponse } from '../base.controller';
import { IUpdateCompanyOutput } from '../../../domain/interfaces';

@Controller('companies')
export class UpdateCompanyController extends BaseController {
  constructor(private readonly updateCompanyUseCase: UpdateCompanyUseCase) {
    super();
  }

  @Patch(':id')
  @Roles(RoleEnum.COMPANY_OWNER)
  async handle(
    @Param('id') id: string,
    @Body() dto: UpdateCompanyDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<IApiResponse<IUpdateCompanyOutput>> {
    if (user.companyId !== id) {
      throw new ForbiddenException('You can only update your own company');
    }
    const result = await this.updateCompanyUseCase.execute({ ...dto, id });
    return this.success(result);
  }
}

