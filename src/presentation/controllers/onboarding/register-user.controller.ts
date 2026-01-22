import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { Public } from '../../../infra/commons/decorators';
import { HateoasBuilder, IHateoasLinks } from '../../../infra/commons/hateoas';
import { RegisterUserUseCase } from '../../../use-cases/onboarding';
import { RegisterDto } from '../../dtos';
import { IRegisterOutput } from '../../../domain/interfaces';

interface IRegisterResponse extends IRegisterOutput {
  _links: IHateoasLinks;
}

@ApiTags('Onboarding')
@Controller('onboarding')
export class RegisterUserController {
  constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registro de usuário',
    description: 'Cria um novo usuário e retorna um token JWT',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'Usuário registrado com sucesso',
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'João Silva',
        email: 'joao@email.com',
        phone: '11999999999',
        role: 'USER',
        stepOnboarding: 'PROFILE',
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        _links: {
          self: { href: '/onboarding/register', method: 'POST', rel: 'self' },
          login: { href: '/auth/login', method: 'POST', rel: 'login' },
          profile: {
            href: '/users/550e8400-e29b-41d4-a716-446655440000',
            method: 'GET',
            rel: 'profile',
          },
          createAddress: {
            href: '/onboarding/addresses',
            method: 'POST',
            rel: 'create-address',
          },
        },
      },
    },
  })
  @ApiResponse({ status: 409, description: 'Email já cadastrado' })
  async handle(@Body() dto: RegisterDto): Promise<IRegisterResponse> {
    const result = await this.registerUserUseCase.execute(dto);

    const links = new HateoasBuilder()
      .self('/onboarding/register', 'POST')
      .add('login', '/auth/login', 'POST')
      .add('register-company', '/onboarding/register-company', 'POST')
      .add('profile', `/users/${result.id}`, 'GET')
      .add('create-address', '/onboarding/addresses', 'POST')
      .build();

    return { ...result, _links: links };
  }
}

