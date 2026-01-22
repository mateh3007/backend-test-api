import { Body, Controller, ForbiddenException, Patch } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { CurrentUser } from '../../../infra/commons/decorators';
import type { ICurrentUser } from '../../../infra/commons/decorators/current-user.decorator';
import { HateoasBuilder, IHateoasLinks } from '../../../infra/commons/hateoas';
import { UpdateCompanyUseCase } from '../../../use-cases/companies';
import { UpdateCompanyDto } from '../../dtos';
import { IUpdateCompanyOutput } from '../../../domain/interfaces';

interface IUpdateCompanyResponse extends IUpdateCompanyOutput {
  _links: IHateoasLinks;
}

@ApiTags('Companies')
@ApiBearerAuth('JWT-auth')
@Controller('companies')
export class UpdateCompanyController {
  constructor(private readonly updateCompanyUseCase: UpdateCompanyUseCase) {}

  @Patch()
  @ApiOperation({
    summary: 'Atualizar empresa',
    description: 'Atualiza a empresa do usuário autenticado (apenas COMPANY_OWNER)',
  })
  @ApiBody({ type: UpdateCompanyDto })
  @ApiResponse({ status: 200, description: 'Empresa atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  @ApiResponse({ status: 403, description: 'Usuário não possui empresa' })
  async handle(
    @Body() dto: UpdateCompanyDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<IUpdateCompanyResponse> {
    if (!user.companyId) {
      throw new ForbiddenException('User does not have a company');
    }

    const result = await this.updateCompanyUseCase.execute({
      ...dto,
      id: user.companyId,
    });

    const links = new HateoasBuilder()
      .self(`/companies/${user.companyId}`, 'PATCH')
      .add('company', `/companies/${user.companyId}`, 'GET')
      .add('addresses', `/addresses?companyId=${user.companyId}`, 'GET')
      .add('products', `/products?sellerId=${user.companyId}`, 'GET')
      .build();

    return { ...result, _links: links };
  }
}
