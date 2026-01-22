import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { Public } from '../../../infra/commons/decorators';
import { HateoasBuilder, IHateoasLinks } from '../../../infra/commons/hateoas';
import { RegisterCompanyUseCase } from '../../../use-cases/onboarding';
import { RegisterCompanyDto } from '../../dtos';

interface IRegisterCompanyResponse {
  company: {
    id: string;
    corporateName: string;
    cnpj: string;
    phone: string;
    email: string;
    createdAt: Date;
  };
  owner: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    stepOnboarding: string;
  };
  accessToken: string;
  _links: IHateoasLinks;
}

@ApiTags('Onboarding')
@Controller('onboarding')
export class RegisterCompanyController {
  constructor(
    private readonly registerCompanyUseCase: RegisterCompanyUseCase,
  ) {}

  @Public()
  @Post('register-company')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registro de empresa',
    description:
      'Cria uma nova empresa e um usuário COMPANY_OWNER associado. Retorna token JWT.',
  })
  @ApiBody({ type: RegisterCompanyDto })
  @ApiResponse({
    status: 201,
    description: 'Empresa e dono registrados com sucesso',
    schema: {
      example: {
        company: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          corporateName: 'Empresa LTDA',
          cnpj: '12.345.678/0001-90',
          phone: '1133334444',
          email: 'contato@empresa.com',
          createdAt: '2026-01-20T12:00:00.000Z',
        },
        owner: {
          id: '550e8400-e29b-41d4-a716-446655440001',
          name: 'João Silva',
          email: 'joao@empresa.com',
          phone: '11999999999',
          role: 'COMPANY_OWNER',
          stepOnboarding: 'PROFILE',
        },
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        _links: {
          self: {
            href: '/onboarding/register-company',
            method: 'POST',
            rel: 'self',
          },
          login: { href: '/auth/login', method: 'POST', rel: 'login' },
          company: {
            href: '/companies/550e8400-e29b-41d4-a716-446655440000',
            method: 'GET',
            rel: 'company',
          },
          updateCompany: {
            href: '/companies/550e8400-e29b-41d4-a716-446655440000',
            method: 'PATCH',
            rel: 'update-company',
          },
          createAddress: {
            href: '/addresses',
            method: 'POST',
            rel: 'create-address',
          },
          products: {
            href: '/products?sellerId=550e8400-e29b-41d4-a716-446655440000',
            method: 'GET',
            rel: 'products',
          },
        },
      },
    },
  })
  @ApiResponse({ status: 409, description: 'CNPJ ou email já cadastrado' })
  async handle(
    @Body() dto: RegisterCompanyDto,
  ): Promise<IRegisterCompanyResponse> {
    const result = await this.registerCompanyUseCase.execute(dto);

    const links = new HateoasBuilder()
      .self('/onboarding/register-company', 'POST')
      .add('login', '/auth/login', 'POST')
      .add('register-user', '/auth/register', 'POST')
      .add('company', `/companies/${result.company.id}`, 'GET')
      .add('update-company', `/companies/${result.company.id}`, 'PATCH')
      .add('create-address', '/onboarding/addresses', 'POST')
      .add(
        'products',
        `/products?sellerId=${result.company.id}`,
        'GET',
      )
      .build();

    return { ...result, _links: links };
  }
}

