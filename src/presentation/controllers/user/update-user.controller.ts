import { Body, Controller, Patch } from '@nestjs/common';
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
import { UpdateUserUseCase } from '../../../use-cases/users';
import { UpdateUserDto } from '../../dtos';
import { IUpdateUserOutput } from '../../../domain/interfaces';

interface IUpdateUserResponse extends IUpdateUserOutput {
  _links: IHateoasLinks;
}

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UpdateUserController {
  constructor(private readonly updateUserUseCase: UpdateUserUseCase) {}

  @Patch()
  @ApiOperation({
    summary: 'Atualizar usuário',
    description: 'Atualiza o usuário autenticado',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async handle(
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<IUpdateUserResponse> {
    const result = await this.updateUserUseCase.execute({
      ...dto,
      id: user.id,
    });

    const links = new HateoasBuilder()
      .self(`/users/${user.id}`, 'PATCH')
      .add('user', `/users/${user.id}`, 'GET')
      .add('addresses', `/addresses?userId=${user.id}`, 'GET')
      .build();

    return { ...result, _links: links };
  }
}
