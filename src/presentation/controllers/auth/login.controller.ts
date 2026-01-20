import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { Public } from '../../../infra/commons/decorators';
import { HateoasBuilder, IHateoasLinks } from '../../../infra/commons/hateoas';
import { LoginUseCase } from '../../../use-cases/auth';
import { LoginDto } from '../../dtos';
import { ILoginOutput } from '../../../domain/interfaces';

interface ILoginResponse extends ILoginOutput {
  _links: IHateoasLinks;
}

@ApiTags('Auth')
@Controller('auth')
export class LoginController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login de usuário',
    description: 'Autentica um usuário e retorna um token JWT',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async handle(@Body() dto: LoginDto): Promise<ILoginResponse> {
    const result = await this.loginUseCase.execute(dto);

    const links = new HateoasBuilder()
      .self('/auth/login', 'POST')
      .add('profile', `/users/${result.user.id}`, 'GET')
      .add('update-profile', `/users/${result.user.id}`, 'PATCH')
      .add('products', '/products', 'GET')
      .add('create-product', '/products', 'POST')
      .add('orders', '/orders', 'GET')
      .build();

    return { ...result, _links: links };
  }
}
