import { Injectable } from '@nestjs/common';
import { Order as PrismaOrder, Prisma } from '@prisma/client';
import { Prisma as PrismaClient } from '@prisma/client';
import { OrderEntity } from '../../../domain/entities';
import { OrderStatusEnum, UserTypeEnum } from '../../../domain/enum';
import {
  IOrderRepositoryFilter,
  OrderRepository,
} from '../../../domain/repositories';
import { PrismaService } from '../prisma/prisma.service';
import { BasePrismaRepository } from './base.prisma-repository';

@Injectable()
export class OrderPrismaRepository
  extends BasePrismaRepository<OrderEntity, PrismaOrder>
  implements OrderRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, prisma.order);
  }

  protected toDomain(prismaModel: PrismaOrder): OrderEntity {
    const order = new OrderEntity({});
    order._id = prismaModel.id;
    order.productId = prismaModel.productId;
    order.productQuantity = prismaModel.productQuantity;
    order.shippingCost = Number(prismaModel.shippingCost);
    order.totalPrice = Number(prismaModel.totalPrice);
    order.status = prismaModel.status as OrderStatusEnum;
    order.sellerId = prismaModel.sellerId;
    order.sellerType = prismaModel.sellerType as UserTypeEnum;
    order.buyerId = prismaModel.buyerId;
    order._createdAt = prismaModel.createdAt;
    order._updatedAt = prismaModel.updatedAt;
    return order;
  }

  protected toPrisma(entity: OrderEntity): Record<string, unknown> {
    return {
      id: entity._id,
      productId: entity.productId,
      productQuantity: entity.productQuantity,
      shippingCost: new PrismaClient.Decimal(entity.shippingCost),
      totalPrice: new PrismaClient.Decimal(entity.totalPrice),
      status: entity.status,
      sellerId: entity.sellerId,
      sellerType: entity.sellerType,
      buyerId: entity.buyerId,
    };
  }

  async findByFilter(filter: IOrderRepositoryFilter): Promise<OrderEntity[]> {
    const where: Prisma.OrderWhereInput = {};

    if (filter.status) where.status = filter.status;

    const results = await this.prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return results.map((result) => this.toDomain(result));
  }
}
