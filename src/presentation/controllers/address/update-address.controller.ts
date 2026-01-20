import { Body, Controller, Param, Patch } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { HateoasBuilder, IHateoasLinks } from '../../../infra/commons/hateoas';
import { UpdateAddressUseCase } from '../../../use-cases/addresses';
import { UpdateAddressDto } from '../../dtos';
import { IUpdateAddressOutput } from '../../../domain/interfaces';

interface IUpdateAddressResponse extends IUpdateAddressOutput {
  _links: IHateoasLinks;
}

@ApiTags('Addresses')
@ApiBearerAuth('JWT-auth')
@Controller('addresses')
export class UpdateAddressController {
  constructor(private readonly updateAddressUseCase: UpdateAddressUseCase) {}

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar endereço',
    description: 'Atualiza um endereço existente',
  })
  @ApiParam({ name: 'id', description: 'ID do endereço' })
  @ApiBody({ type: UpdateAddressDto })
  @ApiResponse({ status: 200, description: 'Endereço atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Endereço não encontrado' })
  async handle(
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
  ): Promise<IUpdateAddressResponse> {
    const result = await this.updateAddressUseCase.execute({ ...dto, id });

    const links = new HateoasBuilder()
      .self(`/addresses/${id}`, 'PATCH')
      .add('address', `/addresses/${id}`, 'GET')
      .add('delete', `/addresses/${id}`, 'DELETE')
      .add('owner', `/${(result.addressableType || 'user').toLowerCase()}s/${result.addressableId}`, 'GET')
      .build();

    return { ...result, _links: links };
  }
}
