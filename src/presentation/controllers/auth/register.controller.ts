import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { Public } from '../../../infra/commons/decorators';
import { HateoasBuilder, IHateoasLinks } from '../../../infra/commons/hateoas';
import { RegisterUseCase } from '../../../use-cases/auth';
import { RegisterDto } from '../../dtos';
import { IRegisterOutput } from '../../../domain/interfaces';

interface IRegisterResponse extends IRegisterOutput {
  _links: IHateoasLinks;
}

@ApiTags('Auth')
@Controller('auth')
export class RegisterController {
  constructor(private readonly registerUseCase: RegisterUseCase) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registro de usuário',
    description: 'Cria um novo usuário e retorna um token JWT',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso' })
  @ApiResponse({ status: 409, description: 'Email já cadastrado' })
  async handle(@Body() dto: RegisterDto): Promise<IRegisterResponse> {
    const result = await this.registerUseCase.execute(dto);

    const links = new HateoasBuilder()
      .self('/auth/register', 'POST')
      .add('login', '/auth/login', 'POST')
      .add('profile', `/users/${result.id}`, 'GET')
      .add('create-address', '/addresses', 'POST')
      .build();

    return { ...result, _links: links };
  }
}
