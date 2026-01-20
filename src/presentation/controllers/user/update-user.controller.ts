import { Body, Controller, Param, Patch } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { Roles } from '../../../infra/commons/decorators';
import { HateoasBuilder, IHateoasLinks } from '../../../infra/commons/hateoas';
import { RoleEnum } from '../../../domain/enum';
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

  @Patch(':id')
  @Roles(RoleEnum.COMPANY_OWNER)
  @ApiOperation({
    summary: 'Atualizar usuário',
    description: 'Atualiza um usuário existente (apenas COMPANY_OWNER)',
  })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async handle(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<IUpdateUserResponse> {
    const result = await this.updateUserUseCase.execute({ ...dto, id });

    const links = new HateoasBuilder()
      .self(`/users/${id}`, 'PATCH')
      .add('user', `/users/${id}`, 'GET')
      .add('delete', `/users/${id}`, 'DELETE')
      .add('addresses', `/addresses?userId=${id}`, 'GET')
      .build();

    return { ...result, _links: links };
  }
}
