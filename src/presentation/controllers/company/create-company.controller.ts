import { Body, Controller, Post } from '@nestjs/common';
import { Roles } from '../../../infra/commons/decorators';
import { RoleEnum } from '../../../domain/enum';
import { CreateCompanyUseCase } from '../../../use-cases/companies';
import { CreateCompanyDto } from '../../dtos';
import { BaseController, IApiResponse } from '../base.controller';
import { ICreateCompanyOutput } from '../../../domain/interfaces';

@Controller('companies')
export class CreateCompanyController extends BaseController {
  constructor(private readonly createCompanyUseCase: CreateCompanyUseCase) {
    super();
  }

  @Post()
  @Roles(RoleEnum.COMPANY_OWNER)
  async handle(
    @Body() dto: CreateCompanyDto,
  ): Promise<IApiResponse<ICreateCompanyOutput>> {
    const result = await this.createCompanyUseCase.execute(dto);
    return this.created(result);
  }
}
