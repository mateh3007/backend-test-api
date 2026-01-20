import { Module } from '@nestjs/common';
import {
  ProductRepository,
  AddressRepository,
} from '../../../domain/repositories';
import {
  ProductPrismaRepository,
  AddressPrismaRepository,
} from '../../database/repositories';
import {
  CreateProductController,
  UpdateProductController,
  DeleteProductController,
  ListProductsController,
  CalculateShippingController,
} from '../../../presentation/controllers/product';
import {
  CreateProductUseCase,
  UpdateProductUseCase,
  DeleteProductUseCase,
  ListProductsUseCase,
  CalculateShippingUseCase,
} from '../../../use-cases/products';
import { DatabaseModule } from '../database';
import { RedisModule } from '../redis';
import { ShippingModule } from '../shipping';

@Module({
  imports: [DatabaseModule, RedisModule, ShippingModule],
  controllers: [
    CreateProductController,
    UpdateProductController,
    DeleteProductController,
    ListProductsController,
    CalculateShippingController,
  ],
  providers: [
    {
      provide: ProductRepository,
      useClass: ProductPrismaRepository,
    },
    {
      provide: AddressRepository,
      useClass: AddressPrismaRepository,
    },
    CreateProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    ListProductsUseCase,
    CalculateShippingUseCase,
  ],
  exports: [ProductRepository],
})
export class ProductsModule {}
