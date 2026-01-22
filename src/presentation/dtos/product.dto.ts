import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CategoryEnum, UserTypeEnum } from '../../domain/enum';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nome do produto',
    example: 'Smartphone XYZ',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Categoria do produto',
    enum: CategoryEnum,
    example: CategoryEnum.ELECTRONICS,
  })
  @IsEnum(CategoryEnum)
  @IsNotEmpty()
  category: CategoryEnum;

  @ApiProperty({
    description: 'Descrição do produto',
    example: 'Smartphone com 128GB de armazenamento',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Preço do produto em reais',
    example: 1999.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Quantidade em estoque',
    example: 50,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({
    description: 'Frete grátis',
    example: false,
  })
  @IsBoolean()
  freeShipping: boolean;
}

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Nome do produto',
    example: 'Smartphone XYZ Pro',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Categoria do produto',
    enum: CategoryEnum,
    example: CategoryEnum.ELECTRONICS,
  })
  @IsEnum(CategoryEnum)
  @IsOptional()
  category?: CategoryEnum;

  @ApiPropertyOptional({
    description: 'Descrição do produto',
    example: 'Smartphone com 256GB de armazenamento',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Preço do produto em reais',
    example: 2499.99,
    minimum: 0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({
    description: 'Quantidade em estoque',
    example: 100,
    minimum: 0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({
    description: 'Frete grátis',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  freeShipping?: boolean;
}

export class ListProductsQueryDto {
  @ApiPropertyOptional({
    description: 'Filtrar por nome do produto',
    example: 'smartphone',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por categoria',
    enum: CategoryEnum,
    example: CategoryEnum.ELECTRONICS,
  })
  @IsEnum(CategoryEnum)
  @IsOptional()
  category?: CategoryEnum;

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
    description: 'Preço mínimo',
    example: 100,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceMin?: number;

  @ApiPropertyOptional({
    description: 'Preço máximo',
    example: 5000,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceMax?: number;

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

export class CalculateShippingDto {
  @ApiProperty({
    description: 'CEP de destino para cálculo do frete',
    example: '01310-100',
  })
  @IsString()
  @IsNotEmpty()
  destinationZipCode: string;
}
