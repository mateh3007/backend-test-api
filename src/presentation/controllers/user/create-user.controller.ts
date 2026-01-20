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
import { CreateUserUseCase } from '../../../use-cases/users';
import { CreateUserDto } from '../../dtos';
import { ICreateUserOutput } from '../../../domain/interfaces';

interface ICreateUserResponse extends ICreateUserOutput {
  _links: IHateoasLinks;
}

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class CreateUserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(RoleEnum.COMPANY_OWNER)
  @ApiOperation({
    summary: 'Criar usuário',
    description: 'Cria um novo usuário (apenas COMPANY_OWNER)',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 409, description: 'Email já cadastrado' })
  async handle(@Body() dto: CreateUserDto): Promise<ICreateUserResponse> {
    const result = await this.createUserUseCase.execute(dto);

    const links = new HateoasBuilder()
      .self('/users', 'POST')
      .add('users', '/users', 'GET')
      .add('create-address', '/addresses', 'POST')
      .build();

    return { ...result, _links: links };
  }
}
