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
import { CreateAddressUseCase } from '../../../use-cases/onboarding';
import { CreateAddressOnboardingDto } from '../../dtos/onboarding.dto';
import { ICreateAddressOutput } from '../../../domain/interfaces';

interface ICreateAddressResponse extends ICreateAddressOutput {
  _links: IHateoasLinks;
}

@ApiTags('Onboarding')
@ApiBearerAuth('JWT-auth')
@Controller('onboarding')
export class CreateAddressController {
  constructor(private readonly createAddressUseCase: CreateAddressUseCase) {}

  @Post('addresses')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar endereço',
    description: 'Cria um novo endereço para o usuário autenticado (parte do onboarding)',
  })
  @ApiBody({ type: CreateAddressOnboardingDto })
  @ApiResponse({ status: 201, description: 'Endereço criado com sucesso' })
  @ApiResponse({ status: 409, description: 'Endereço já existe' })
  async handle(
    @Body() dto: CreateAddressOnboardingDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<ICreateAddressResponse> {
    const addressableType = user.companyId
      ? AddressableEnum.COMPANY
      : AddressableEnum.USER;
    const addressableId = user.companyId || user.id;

    const result = await this.createAddressUseCase.execute({
      ...dto,
      addressableId,
      addressableType,
    });

    const links = new HateoasBuilder()
      .self('/onboarding/addresses', 'POST')
      .add('address', `/addresses/${result.id}`, 'GET')
      .add('update', `/addresses/${result.id}`, 'PATCH')
      .add('delete', `/addresses/${result.id}`, 'DELETE')
      .add('owner', `/${result.addressableType.toLowerCase()}s/${result.addressableId}`, 'GET')
      .build();

    return { ...result, _links: links };
  }
}
