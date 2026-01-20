import { Injectable } from '@nestjs/common';
import { Product as PrismaProduct, Prisma } from '@prisma/client';
import { ProductEntity } from '../../../domain/entities';
import { CategoryEnum, UserTypeEnum } from '../../../domain/enum';
import {
  IProductRepositoryFilter,
  ProductRepository,
} from '../../../domain/repositories';
import { PrismaService } from '../prisma/prisma.service';
import { BasePrismaRepository } from './base.prisma-repository';

@Injectable()
export class ProductPrismaRepository
  extends BasePrismaRepository<ProductEntity, PrismaProduct>
  implements ProductRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, prisma.product);
  }

  protected toDomain(prismaModel: PrismaProduct): ProductEntity {
    const product = new ProductEntity({});
    product._id = prismaModel.id;
    product.name = prismaModel.name;
    product.category = prismaModel.category as CategoryEnum;
    product.description = prismaModel.description;
    product.price = Number(prismaModel.price);
    product.stock = prismaModel.stock;
    product.freeShipping = prismaModel.freeShipping;
    product.sellerId = prismaModel.sellerId;
    product.sellerType = prismaModel.sellerType as UserTypeEnum;
    product._createdAt = prismaModel.createdAt;
    product._updatedAt = prismaModel.updatedAt;
    return product;
  }

  protected toPrisma(entity: ProductEntity): Record<string, unknown> {
    return {
      id: entity._id,
      name: entity.name,
      category: entity.category,
      description: entity.description,
      price: entity.price,
      stock: entity.stock,
      freeShipping: entity.freeShipping,
      sellerId: entity.sellerId,
      sellerType: entity.sellerType,
    };
  }

  async findByFilter(
    filter: IProductRepositoryFilter,
  ): Promise<ProductEntity[]> {
    const where: Prisma.ProductWhereInput = {};
    const orderBy: Prisma.ProductOrderByWithRelationInput = {};

    if (filter.name) {
      where.name = { contains: filter.name, mode: 'insensitive' };
    }
    if (filter.category) where.category = filter.category;
    if (filter.sellerId) where.sellerId = filter.sellerId;
    if (filter.sellerType) where.sellerType = filter.sellerType;
    if (filter.freeShipping !== undefined)
      where.freeShipping = filter.freeShipping;

    if (filter.price) {
      where.price = {};
      if (filter.price.min !== undefined) where.price.gte = filter.price.min;
      if (filter.price.max !== undefined) where.price.lte = filter.price.max;
    }

    if (filter.stock) {
      where.stock = {};
      if (filter.stock.min !== undefined) where.stock.gte = filter.stock.min;
      if (filter.stock.max !== undefined) where.stock.lte = filter.stock.max;
    }

    if (filter.createdAt) {
      where.createdAt = {};
      if (filter.createdAt.min) where.createdAt.gte = filter.createdAt.min;
      if (filter.createdAt.max) where.createdAt.lte = filter.createdAt.max;
    }

    if (filter.sort) {
      orderBy[
        filter.sort.field as keyof Prisma.ProductOrderByWithRelationInput
      ] = filter.sort.order;
    }

    const results = await this.prisma.product.findMany({
      where,
      orderBy: Object.keys(orderBy).length > 0 ? orderBy : undefined,
      skip: filter.offset,
      take: filter.limit,
    });

    return results.map((result) => this.toDomain(result));
  }
}
