import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
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
import { AddressableEnum } from '../../../domain/enum';
import { CreateAddressUseCase } from '../../../use-cases/addresses';
import { CreateAddressDto } from '../../dtos';
import { ICreateAddressOutput } from '../../../domain/interfaces';

interface ICreateAddressResponse extends ICreateAddressOutput {
  _links: IHateoasLinks;
}

@ApiTags('Addresses')
@ApiBearerAuth('JWT-auth')
@Controller('addresses')
export class CreateAddressController {
  constructor(private readonly createAddressUseCase: CreateAddressUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar endereço',
    description: 'Cria um novo endereço para usuário ou empresa',
  })
  @ApiBody({ type: CreateAddressDto })
  @ApiResponse({ status: 201, description: 'Endereço criado com sucesso' })
  @ApiResponse({ status: 409, description: 'Endereço já existe' })
  async handle(
    @Body() dto: CreateAddressDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<ICreateAddressResponse> {
    const result = await this.createAddressUseCase.execute({
      ...dto,
      addressableId: dto.addressableId || user.id,
      addressableType: dto.addressableType || AddressableEnum.USER,
    });

    const links = new HateoasBuilder()
      .self('/addresses', 'POST')
      .add('address', `/addresses/${result.id}`, 'GET')
      .add('update', `/addresses/${result.id}`, 'PATCH')
      .add('delete', `/addresses/${result.id}`, 'DELETE')
      .add('owner', `/${result.addressableType.toLowerCase()}s/${result.addressableId}`, 'GET')
      .build();

    return { ...result, _links: links };
  }
}
