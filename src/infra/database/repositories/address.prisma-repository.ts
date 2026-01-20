import { Injectable } from '@nestjs/common';
import { Address as PrismaAddress } from '@prisma/client';
import { AddressEntity } from '../../../domain/entities';
import { AddressableEnum } from '../../../domain/enum';
import { AddressRepository } from '../../../domain/repositories';
import { PrismaService } from '../prisma/prisma.service';
import { BasePrismaRepository } from './base.prisma-repository';

@Injectable()
export class AddressPrismaRepository
  extends BasePrismaRepository<AddressEntity, PrismaAddress>
  implements AddressRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, prisma.address);
  }

  protected toDomain(prismaModel: PrismaAddress): AddressEntity {
    const address = new AddressEntity({});
    address._id = prismaModel.id;
    address.country = prismaModel.country;
    address.state = prismaModel.state;
    address.city = prismaModel.city;
    address.street = prismaModel.street;
    address.number = prismaModel.number;
    address.complement = prismaModel.complement || '';
    address.zipCode = prismaModel.zipCode;
    address.addressableId = prismaModel.addressableId;
    address.addressableType = prismaModel.addressableType as AddressableEnum;
    address._createdAt = prismaModel.createdAt;
    address._updatedAt = prismaModel.updatedAt;
    return address;
  }

  protected toPrisma(entity: AddressEntity): Record<string, unknown> {
    return {
      id: entity._id,
      country: entity.country,
      state: entity.state,
      city: entity.city,
      street: entity.street,
      number: entity.number,
      complement: entity.complement,
      zipCode: entity.zipCode,
      addressableId: entity.addressableId,
      addressableType: entity.addressableType,
    };
  }

  async findByAddressableIdAndType(
    addressableId: string,
    addressableType: AddressableEnum,
  ): Promise<AddressEntity | null> {
    const result = await this.prisma.address.findFirst({
      where: {
        addressableId,
        addressableType,
      },
    });

    return result ? this.toDomain(result) : null;
  }
}
