import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { Roles } from '../../../infra/commons/decorators';
import { HateoasBuilder, IHateoasLinks } from '../../../infra/commons/hateoas';
import { RoleEnum } from '../../../domain/enum';
import { CreateCompanyUseCase } from '../../../use-cases/companies';
import { CreateCompanyDto } from '../../dtos';
import { ICreateCompanyOutput } from '../../../domain/interfaces';

interface ICreateCompanyResponse extends ICreateCompanyOutput {
  _links: IHateoasLinks;
}

@ApiTags('Companies')
@ApiBearerAuth('JWT-auth')
@Controller('companies')
export class CreateCompanyController {
  constructor(private readonly createCompanyUseCase: CreateCompanyUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(RoleEnum.COMPANY_OWNER)
  @ApiOperation({
    summary: 'Criar empresa',
    description: 'Cria uma nova empresa (apenas COMPANY_OWNER)',
  })
  @ApiBody({ type: CreateCompanyDto })
  @ApiResponse({ status: 201, description: 'Empresa criada com sucesso' })
  @ApiResponse({ status: 409, description: 'CNPJ já cadastrado' })
  async handle(@Body() dto: CreateCompanyDto): Promise<ICreateCompanyResponse> {
    const result = await this.createCompanyUseCase.execute(dto);

    const links = new HateoasBuilder()
      .self('/companies', 'POST')
      .add('company', `/companies/${result.id}`, 'GET')
      .add('update', `/companies/${result.id}`, 'PATCH')
      .add('delete', `/companies/${result.id}`, 'DELETE')
      .add('create-address', '/addresses', 'POST')
      .add('products', `/products?sellerId=${result.id}`, 'GET')
      .build();

    return { ...result, _links: links };
  }
}
