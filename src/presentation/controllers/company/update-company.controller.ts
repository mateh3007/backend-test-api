import {
  Body,
  Controller,
  ForbiddenException,
  Param,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { CurrentUser, Roles } from '../../../infra/commons/decorators';
import type { ICurrentUser } from '../../../infra/commons/decorators/current-user.decorator';
import { HateoasBuilder, IHateoasLinks } from '../../../infra/commons/hateoas';
import { RoleEnum } from '../../../domain/enum';
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

  @Patch(':id')
  @Roles(RoleEnum.COMPANY_OWNER)
  @ApiOperation({
    summary: 'Atualizar empresa',
    description: 'Atualiza uma empresa (apenas o dono da empresa)',
  })
  @ApiParam({ name: 'id', description: 'ID da empresa' })
  @ApiBody({ type: UpdateCompanyDto })
  @ApiResponse({ status: 200, description: 'Empresa atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  async handle(
    @Param('id') id: string,
    @Body() dto: UpdateCompanyDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<IUpdateCompanyResponse> {
    if (user.companyId !== id) {
      throw new ForbiddenException('You can only update your own company');
    }

    const result = await this.updateCompanyUseCase.execute({ ...dto, id });

    const links = new HateoasBuilder()
      .self(`/companies/${id}`, 'PATCH')
      .add('company', `/companies/${id}`, 'GET')
      .add('delete', `/companies/${id}`, 'DELETE')
      .add('addresses', `/addresses?companyId=${id}`, 'GET')
      .add('products', `/products?sellerId=${id}`, 'GET')
      .build();

    return { ...result, _links: links };
  }
}
