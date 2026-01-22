import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatusEnum, UserTypeEnum } from '../../domain/enum';

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

export class ListOrdersQueryDto {
  @ApiPropertyOptional({
    description: 'Filtrar por status do pedido',
    enum: OrderStatusEnum,
    example: OrderStatusEnum.PENDING,
  })
  @IsEnum(OrderStatusEnum)
  @IsOptional()
  status?: OrderStatusEnum;

  @ApiPropertyOptional({
    description: 'Filtrar por ID do comprador',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsOptional()
  buyerId?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por ID do vendedor',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsOptional()
  sellerId?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por tipo de vendedor',
    enum: UserTypeEnum,
    example: UserTypeEnum.COMPANY,
  })
  @IsEnum(UserTypeEnum)
  @IsOptional()
  sellerType?: UserTypeEnum;

  @ApiPropertyOptional({
    description: 'Limite de resultados por página',
    example: 20,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Offset para paginação',
    example: 0,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number;
}
