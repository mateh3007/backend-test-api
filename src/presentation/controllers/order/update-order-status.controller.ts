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
import { UpdateOrderStatusUseCase } from '../../../use-cases/orders';
import { UpdateOrderStatusDto } from '../../dtos';
import { IUpdateOrderStatusOutput } from '../../../domain/interfaces';

interface IUpdateOrderStatusResponse extends IUpdateOrderStatusOutput {
  _links: IHateoasLinks;
}

@ApiTags('Orders')
@ApiBearerAuth('JWT-auth')
@Controller('orders')
export class UpdateOrderStatusController {
  constructor(
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
  ) {}

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Atualizar status do pedido',
    description: 'Atualiza o status de um pedido existente',
  })
  @ApiParam({ name: 'id', description: 'ID do pedido' })
  @ApiBody({ type: UpdateOrderStatusDto })
  @ApiResponse({ status: 200, description: 'Status atualizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Transição de status inválida' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  async handle(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ): Promise<IUpdateOrderStatusResponse> {
    const result = await this.updateOrderStatusUseCase.execute({ ...dto, id });

    const links = new HateoasBuilder()
      .self(`/orders/${id}/status`, 'PATCH')
      .add('order', `/orders/${id}`, 'GET')
      .add('all-orders', '/orders', 'GET')
      .build();

    return { ...result, _links: links };
  }
}
