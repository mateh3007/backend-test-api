import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { OrderStatusEnum } from '../../domain/enum';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(1)
  productQuantity: number;

  @IsNumber()
  @Min(0)
  shippingCost: number;
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatusEnum)
  @IsNotEmpty()
  status: OrderStatusEnum;
}
