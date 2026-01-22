import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { OrderStatusEnum } from '../../domain/enum';

export class CreateOrderDto {
  @ApiProperty({
    description: 'ID do produto',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: 'Quantidade do produto',
    example: 2,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  productQuantity: number;

  @ApiProperty({
    description: 'CEP de destino para cálculo do frete',
    example: '01310-100',
  })
  @IsString()
  @IsNotEmpty()
  destinationZipCode: string;
}

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'Novo status do pedido',
    enum: OrderStatusEnum,
    example: OrderStatusEnum.CONFIRMED,
  })
  @IsEnum(OrderStatusEnum)
  @IsNotEmpty()
  status: OrderStatusEnum;
}
