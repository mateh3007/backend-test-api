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
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(CategoryEnum)
  @IsNotEmpty()
  category: CategoryEnum;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsBoolean()
  freeShipping: boolean;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(CategoryEnum)
  @IsOptional()
  category?: CategoryEnum;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  stock?: number;

  @IsBoolean()
  @IsOptional()
  freeShipping?: boolean;
}

export class ListProductsQueryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(CategoryEnum)
  @IsOptional()
  category?: CategoryEnum;

  @IsString()
  @IsOptional()
  sellerId?: string;

  @IsEnum(UserTypeEnum)
  @IsOptional()
  sellerType?: UserTypeEnum;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  freeShipping?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceMax?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number;
}

export class CalculateShippingDto {
  @IsString()
  @IsNotEmpty()
  destinationZipCode: string;
}
